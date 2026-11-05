import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const JSON_SERVER_URL = process.env.JSON_SERVER_URL || 'http://127.0.0.1:3001';

// Ensure /uploads directory exists
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    // Allow images and code files
    if (file.mimetype.startsWith('image/') || /\.(svg|png|jpe?g|webp|gif|html|css|js|txt)$/i.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(null, true); // permissive for educational game assets
    }
  }
});

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static assets
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(path.resolve(process.cwd(), 'public')));

// Upload endpoints
app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, error: 'No se subió ningún archivo' });
    return;
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

app.post('/api/upload-avatar', upload.single('avatar'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, error: 'No se subió ningún avatar' });
    return;
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

app.post('/api/upload-cover', upload.single('cover'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, error: 'No se subió ninguna portada' });
    return;
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// Transparent proxy to JSON Server (port 3001) for /api/db/* as well as direct /games and /users
const proxyToJsonServer = async (req: Request, res: Response, targetPath: string) => {
  try {
    const url = new URL(targetPath, JSON_SERVER_URL);
    // Copy query parameters
    for (const [key, val] of Object.entries(req.query)) {
      if (Array.isArray(val)) {
        val.forEach(v => url.searchParams.append(key, String(v)));
      } else if (val !== undefined) {
        url.searchParams.set(key, String(val));
      }
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const fetchOptions: RequestInit = {
      method: req.method,
      headers
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const jsonRes = await fetch(url.toString(), fetchOptions);
    const data = await jsonRes.text();
    
    res.status(jsonRes.status);
    const contentType = jsonRes.headers.get('content-type');
    if (contentType) res.setHeader('content-type', contentType);
    res.send(data);
  } catch (err: any) {
    console.error('Error al comunicar con JSON Server:', err.message);
    res.status(503).json({
      error: 'JSON Server no disponible',
      details: err.message
    });
  }
};

app.all('/api/db/*', (req: Request, res: Response) => {
  const targetPath = req.url.replace('/api/db', '');
  proxyToJsonServer(req, res, targetPath || '/');
});

app.all('/games*', (req: Request, res: Response) => {
  proxyToJsonServer(req, res, req.url);
});

app.all('/users*', (req: Request, res: Response) => {
  proxyToJsonServer(req, res, req.url);
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', server: 'Eduarcade Express', timestamp: new Date() });
});

// Single-page application fallback: any other route serves /public/index.html
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.resolve(process.cwd(), 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Eduarcade Express activo en http://0.0.0.0:${PORT}`);
  console.log(`📦 Proxying JSON Server desde ${JSON_SERVER_URL}`);
});
