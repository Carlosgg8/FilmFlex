import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../models/Post.js';
import User from '../models/User.js';

dotenv.config();

/**
 * Migration script to update existing comments from old structure to new structure
 * Old: { from: userId, profile_name: "...", profile_image_url: "..." }
 * New: { user: ObjectId(userId), ... } with populated user reference
 */

async function migrateComments() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all posts
    const posts = await Post.find({});
    console.log(`Found ${posts.length} posts to check`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const post of posts) {
      let needsUpdate = false;

      // Check each comment in the post
      for (let i = 0; i < post.comments.length; i++) {
        const comment = post.comments[i];

        // Check if this is an old-style comment (has 'from' field or no 'user' field)
        if (!comment.user && (comment.from || comment.profile_name)) {
          console.log(`Migrating comment in post ${post._id}`);
          
          // Try to find the user by various methods
          let userId = comment.from;
          
          if (!userId && comment.profile_name) {
            // Try to find user by username
            const user = await User.findOne({ username: comment.profile_name });
            if (user) {
              userId = user._id;
            }
          }

          if (userId) {
            // Validate that this is a valid ObjectId or convert string to ObjectId
            try {
              comment.user = mongoose.Types.ObjectId(userId);
              needsUpdate = true;
            } catch (err) {
              console.error(`Invalid userId for comment: ${userId}`, err);
              errorCount++;
            }
          } else {
            console.warn(`Could not find user for comment in post ${post._id}`);
            errorCount++;
          }
        }
      }

      // Save the post if any comments were updated
      if (needsUpdate) {
        try {
          await post.save();
          updatedCount++;
          console.log(`Updated post ${post._id}`);
        } catch (err) {
          console.error(`Error updating post ${post._id}:`, err);
          errorCount++;
        }
      }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Total posts checked: ${posts.length}`);
    console.log(`Posts updated: ${updatedCount}`);
    console.log(`Errors encountered: ${errorCount}`);
    console.log('=========================\n');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateComments();
