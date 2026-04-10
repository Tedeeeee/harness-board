import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';

const router = Router();

// GET /api/posts — 목록 (페이지네이션 + 검색)
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const size = Math.max(1, Math.min(100, parseInt(req.query.size) || 10));
    const { searchType, keyword } = req.query;

    const where = { deletedAt: null };

    if (keyword && keyword.trim()) {
      const trimmed = keyword.trim();
      if (['title', 'content', 'author'].includes(searchType)) {
        where[searchType] = { contains: trimmed };
      }
    }

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        select: { id: true, title: true, author: true, views: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      posts,
      totalCount,
      totalPages: Math.ceil(totalCount / size),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// GET /api/posts/:id — 상세 (조회수 +1)
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: '유효하지 않은 ID입니다.' });

    const post = await prisma.post.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, title: true, content: true, author: true, views: true, createdAt: true },
    });

    if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    await prisma.post.update({ where: { id }, data: { views: { increment: 1 } } });

    res.json({ ...post, views: post.views + 1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// POST /api/posts — 작성
router.post('/', async (req, res) => {
  try {
    const { title, content, author, password } = req.body;

    const errors = [];
    if (!title || !title.trim()) errors.push('제목을 입력해주세요.');
    else if (title.trim().length > 100) errors.push('제목은 100자 이내로 입력해주세요.');
    if (!content || !content.trim()) errors.push('내용을 입력해주세요.');
    else if (content.trim().length > 10000) errors.push('내용은 10,000자 이내로 입력해주세요.');
    if (!author || !author.trim()) errors.push('작성자명을 입력해주세요.');
    else if (author.trim().length > 20) errors.push('작성자명은 20자 이내로 입력해주세요.');
    if (!password || password.length < 4) errors.push('비밀번호는 4자리 이상 입력해주세요.');

    if (errors.length > 0) return res.status(400).json({ error: errors[0], errors });

    const hashedPassword = await bcrypt.hash(password, 10);

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        password: hashedPassword,
      },
    });

    res.status(201).json({ id: post.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// PUT /api/posts/:id — 수정 (author 변경 불가)
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: '유효하지 않은 ID입니다.' });

    const { title, content, password } = req.body;

    const errors = [];
    if (!title || !title.trim()) errors.push('제목을 입력해주세요.');
    else if (title.trim().length > 100) errors.push('제목은 100자 이내로 입력해주세요.');
    if (!content || !content.trim()) errors.push('내용을 입력해주세요.');
    else if (content.trim().length > 10000) errors.push('내용은 10,000자 이내로 입력해주세요.');
    if (!password) errors.push('비밀번호를 입력해주세요.');

    if (errors.length > 0) return res.status(400).json({ error: errors[0], errors });

    const post = await prisma.post.findFirst({ where: { id, deletedAt: null } });
    if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    if (!(await bcrypt.compare(password, post.password))) {
      return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    await prisma.post.update({
      where: { id },
      data: { title: title.trim(), content: content.trim() },
    });

    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// DELETE /api/posts/:id — 삭제 (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: '유효하지 않은 ID입니다.' });

    const { password } = req.body;
    if (!password) return res.status(400).json({ error: '비밀번호를 입력해주세요.' });

    const post = await prisma.post.findFirst({ where: { id, deletedAt: null } });
    if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    if (!(await bcrypt.compare(password, post.password))) {
      return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    await prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

export default router;
