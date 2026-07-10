import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function getFileType(file: File): 'image' | 'pdf' | 'document' {
  const lower = file.name.toLowerCase();
  if (file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(lower)) return 'image';
  if (file.type === 'application/pdf' || lower.endsWith('.pdf')) return 'pdf';
  return 'document';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Archivo requerido' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'El archivo supera el limite de 10MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = sanitizeFilename(file.name || 'file');
    const ext = path.extname(safeName);
    const base = path.basename(safeName, ext);
    const filename = `${base}-${randomUUID()}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'chat');
    await mkdir(uploadsDir, { recursive: true });

    const absolutePath = path.join(uploadsDir, filename);
    await writeFile(absolutePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/chat/${filename}`,
      fileType: getFileType(file),
      fileName: file.name,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'Error al subir archivo' }, { status: 500 });
  }
}
