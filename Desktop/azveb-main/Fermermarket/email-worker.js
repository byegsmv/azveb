import PostalMime from 'postal-mime';

function arrayBufferToBase64(buffer) {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

export default {
  async email(message, env, ctx) {
    try {
      console.log(`[Email Worker] Gələn məktub: ${message.from} -> ${message.to}`);

      let bodyText = '';
      let bodyHtml = '';
      let subject = message.headers.get('subject') || '(Mövzusuz)';
      let fromAddress = message.from || '';
      let fromName = '';
      let toAddress = message.to || 'info@fermermarket.az';
      let messageId = message.headers.get('message-id') || `msg_${Date.now()}`;
      let attachments = [];

      try {
        const rawEmail = await new Response(message.raw).arrayBuffer();
        const parser = new PostalMime();
        const parsed = await parser.parse(rawEmail);

        fromAddress = parsed.from?.address || fromAddress;
        fromName = parsed.from?.name || '';
        toAddress = parsed.to?.[0]?.address || toAddress;
        subject = parsed.subject || subject;
        bodyText = parsed.text || '';
        bodyHtml = parsed.html || '';
        messageId = parsed.messageId || messageId;

        if (parsed.attachments && Array.isArray(parsed.attachments)) {
          attachments = parsed.attachments.map((att) => ({
            filename: att.filename || 'attachment',
            mimeType: att.mimeType || 'application/octet-stream',
            disposition: att.disposition || null,
            related: att.related || false,
            contentId: att.contentId || null,
            content: arrayBufferToBase64(att.content),
          }));
        }
      } catch (parseErr) {
        console.warn('[Email Worker] PostalMime parse fallback:', parseErr.message);
        bodyText = `Məktub mətni: ${message.from}`;
      }

      const payload = {
        from: fromAddress,
        fromName,
        to: toAddress,
        subject,
        bodyText,
        bodyHtml,
        messageId,
        attachments,
      };

      const webhookSecret = env.WEBHOOK_SECRET || '';
      const webhookUrl = env.WEBHOOK_URL || 'https://fermermarket.az/api/emails/webhook';

      console.log(`[Email Worker] Webhook-a göndərilir: ${webhookUrl}`);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-secret': webhookSecret,
        },
        body: JSON.stringify(payload),
      });

      console.log(`[Email Worker] Webhook cavab kodu: ${response.status}`);

      if (!response.ok) {
        const errText = await response.text();
        console.error(`[Email Worker] Webhook xətası (${response.status}): ${errText}`);
      } else {
        console.log(`[Email Worker] Məktub uğurla qəbul edildi!`);
      }
    } catch (error) {
      console.error('[Email Worker] Xəta:', error.message);
    }
  },
};
