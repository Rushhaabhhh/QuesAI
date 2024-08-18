const mongoose = require('mongoose');

const PodcastSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    
    fileUrl: String, 
    rssUrl: String,
    youtubeLink: String,
    uploadedFiles: [{ 
        fileName: String,
        fileUrl: String
    }],
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Podcast', PodcastSchema);
