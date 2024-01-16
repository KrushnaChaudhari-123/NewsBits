const mongoose = require('mongoose');

const newsArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    
  },
  imageUrl: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  newsUrl: {
    type: String,
    required: true
  },
  author: {
    type: String,
    
  },
  date: {
    type: String,
    default: Date.now  // Default value is set to the current date and time
  },
  source: {
    type: String,
    default: 'Unknown'  // Default value is set to 'Unknown'
  }
}, {collection: "favs"});

const NewsArticle = mongoose.model('NewsArticle', newsArticleSchema);

module.exports = NewsArticle;
