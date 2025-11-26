const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');

/**
 * @route   GET /api/news
 * @desc    Get top 20 financial news with language support
 * @access  Public
 */
router.get('/', async (req, res) => {
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
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/news/:id
 * @desc    Get full article details by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
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
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/news/refresh
 * @desc    Manually trigger news refresh
 * @access  Public
 */
router.post('/refresh', async (req, res) => {
  try {
    await newsService.fetchAndStoreNews();

    res.json({
      success: true,
      message: 'News refreshed successfully',
    });
  } catch (error) {
    console.error('Error refreshing news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh news',
      error: error.message,
    });
  }
});

module.exports = router;
