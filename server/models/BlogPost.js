const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const BlogPostSchema = new Schema({
  author: ObjectId,
  title: String,
  body: String,
  date: Date,
  view: Number,
});

const BlogPost = mongoose.model('BlogPostCrushBooks', BlogPostSchema);