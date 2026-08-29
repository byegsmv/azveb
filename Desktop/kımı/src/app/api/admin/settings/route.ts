import { NextRequest, NextResponse } from "next/server";
import { defaultSettings, SiteSettings } from "@/lib/siteSettings";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "site-settings.json");

// In-memory / file cached settings loader
function getStoredSettings(): SiteSettings {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, "utf8");
      return JSON.parse(fileData);
    }
  } catch (e) {
    console.error("Error reading site settings file:", e);
  }
  return defaultSettings;
}

function saveStoredSettings(data: SiteSettings) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing site settings file:", e);
  }
}

export async function GET() {
  const settings = getStoredSettings();
  return NextResponse.json({ success: true, data: settings });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    saveStoredSettings(body);
    return NextResponse.json({ success: true, message: "Parametrlər uğurla yadda saxlanıldı!", data: body });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Yadda saxlama zamanı xəta baş verdi." }, { status: 500 });
  }
}
