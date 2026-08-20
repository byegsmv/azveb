@@
   const [showReplyForm, setShowReplyForm] = useState(false);
   const [replySubject, setReplySubject] = useState("");
   const [replyBody, setReplyBody] = useState("");
   const [sendingReply, setSendingReply] = useState(false);
+  const [showComposeForm, setShowComposeForm] = useState(false);
+  const [composeTo, setComposeTo] = useState("");
+  const [composeSubject, setComposeSubject] = useState("");
+  const [composeBody, setComposeBody] = useState("");
+  const [sendingCompose, setSendingCompose] = useState(false);
@@
-        <button
-          onClick={() => {
-            fetchEmails(filter, page);
-            fetchStats();
-          }}
-          className="self-start sm:self-auto flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm"
-        >
-          <Icon name="refresh" size={16} />
-          Yenilə
-        </button>
+        <div className="flex gap-2">
+          <button
+            onClick={() => setShowComposeForm(true)}
+            className="self-start sm:self-auto flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition shadow-sm"
+          >
+            <Icon name="send" size={16} />
+            Yeni Məktub
+          </button>
+
+          <button
+            onClick={() => {
+              fetchEmails(filter, page);
+              fetchStats();
+            }}
+            className="self-start sm:self-auto flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm"
+          >
+            <Icon name="refresh" size={16} />
+            Yenilə
+          </button>
+        </div>
@@
               {/* Reply Form */}
               {showReplyForm && (
@@
               )}
+
+              {/* Compose New Email Modal */}
+              {showComposeForm && (
+                <form
+                  onSubmit={async (e) => {
+                    e.preventDefault();
+                    if (!composeTo.trim() || !composeBody.trim()) {
+                      toast("To və mesaj mətnini daxil edin", "warning");
+                      return;
+                    }
+                    setSendingCompose(true);
+                    try {
+                      const res = await apiFetch(`/api/admin/emails/send`, {
+                        method: "POST",
+                        body: JSON.stringify({ to: composeTo, subject: composeSubject, body: composeBody }),
+                      });
+                      if (res?.error) throw new Error(res.error);
+                      toast("Məktub göndərildi", "success");
+                      setShowComposeForm(false);
+                      setComposeTo("");
+                      setComposeSubject("");
+                      setComposeBody("");
+                    } catch (err) {
+                      toast(err.message || "Göndərmək mümkün olmadı", "error");
+                    } finally {
+                      setSendingCompose(false);
+                    }
+                  }}
+                  className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4 animate-fade-in"
+                >
+                  <div className="flex items-center justify-between">
+                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
+                      <Icon name="send" size={16} className="text-emerald-600" />
+                      Yeni Məktub
+                    </h3>
+                    <button type="button" onClick={() => setShowComposeForm(false)} className="text-gray-400 hover:text-gray-600 transition">
+                      <Icon name="close" size={18} />
+                    </button>
+                  </div>
+
+                  <div>
+                    <label className="block text-xs font-medium text-gray-600 mb-1">Kime *</label>
+                    <input
+                      type="email"
+                      required
+                      value={composeTo}
+                      onChange={(e) => setComposeTo(e.target.value)}
+                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
+                      placeholder="recipient@example.com"
+                    />
+                  </div>
+
+                  <div>
+                    <label className="block text-xs font-medium text-gray-600 mb-1">Mövzu</label>
+                    <input
+                      type="text"
+                      value={composeSubject}
+                      onChange={(e) => setComposeSubject(e.target.value)}
+                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
+                      placeholder="Mövzu..."
+                    />
+                  </div>
+
+                  <div>
+                    <label className="block text-xs font-medium text-gray-600 mb-1">Mətn *</label>
+                    <textarea
+                      rows={6}
+                      required
+                      value={composeBody}
+                      onChange={(e) => setComposeBody(e.target.value)}
+                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
+                      placeholder="Məktub mətnini daxil edin..."
+                    />
+                  </div>
+
+                  <div className="flex items-center justify-end gap-3 pt-2">
+                    <button type="button" onClick={() => setShowComposeForm(false)} className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition">
+                      Ləğv et
+                    </button>
+                    <button type="submit" disabled={sendingCompose} className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl transition disabled:opacity-50">
+                      {sendingCompose ? (
+                        <>
+                          <Icon name="refresh" size={14} className="animate-spin" /> Göndərilir...
+                        </>
+                      ) : (
+                        <>
+                          <Icon name="send" size={14} /> Göndər
+                        </>
+                      )}
+                    </button>
+                  </div>
+                </form>
+              )}
@@
   );
 }
