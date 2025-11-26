import { Router, Request, Response } from 'express';

const router = Router();
const newsService = require('../../services/newsService');

/**
 * @route   GET /api/news
 * @desc    Get top 8 financial news with language support
 * @access  Public
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { language = 'english' } = req.query;

    const news = await newsService.getNews(language);

    res.json({
      success: true,
      data: {
        articles: news.articles,
        lastUpdated: news.lastUpdated,
        totalCount: news.articles.length,
      },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @route   GET /api/news/:id
 * @desc    Get full article details by ID
 * @access  Public
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await newsService.getArticleById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // Get related news
    const relatedNews = await newsService.getRelatedNews(
      article.category,
      id,
      5
    );

    res.json({
      success: true,
      data: {
        article,
        relatedNews,
      },
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch article',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @route   POST /api/news/refresh
 * @desc    Manually trigger news refresh (testing mode - 8 articles)
 * @access  Public
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    await newsService.fetchAndStoreNews(false); // isScheduled = false, fetches 8 articles for testing

    res.json({
      success: true,
      message: 'News refreshed successfully (testing mode - 8 articles)',
    });
  } catch (error) {
    console.error('Error refreshing news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh news',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
