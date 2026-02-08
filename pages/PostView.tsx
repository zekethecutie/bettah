import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, MessageCircle, Send, Heart, Calendar } from 'lucide-react';
import { Post } from '../types';
import { UserManager } from '../utils/storage';

interface PostViewProps {
  postId: string;
  onBack: () => void;
}

const PostView: React.FC<PostViewProps> = ({ postId, onBack }) => {
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [newComment, setNewComment] = useState('');
  const [currentUser] = useState(UserManager.getCurrentUser());

  useEffect(() => {
    const p = UserManager.getPost(postId);
    setPost(p);
  }, [postId]);

  const handleLike = () => {
      if(post) {
          UserManager.likePost(post.id);
          setPost(UserManager.getPost(postId)); // refresh
      }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
      e.preventDefault();
      if(post && newComment.trim()) {
          UserManager.addComment(post.id, newComment);
          setNewComment('');
          setPost(UserManager.getPost(postId)); // refresh
      }
  };

  if (!post) return <div className="p-10 text-center text-slate-500">Post not found</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 lg:p-8 animate-in slide-in-from-right duration-300 mb-20">
       <button 
         onClick={onBack}
         className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
       >
         <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
         <span className="font-bold">Back to Forum</span>
       </button>

       <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800">
             <div className="flex items-center gap-4 mb-6">
                <img src={post.authorAvatar} className="w-12 h-12 rounded-xl bg-slate-800" alt={post.authorName} />
                <div>
                   <h3 className="font-bold text-white text-lg">{post.authorName}</h3>
                   <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.timestamp).toLocaleString()}
                   </div>
                </div>
             </div>
             
             <h1 className="text-3xl font-black text-white mb-6 tracking-tight">{post.title}</h1>
             <div className="prose prose-invert prose-lg text-slate-300">
                 {post.content.split('\n').map((p, i) => <p key={i} className="mb-4">{p}</p>)}
             </div>
             
             <div className="flex items-center gap-6 mt-8 pt-6 border-t border-slate-800/50">
                <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${post.likedBy.includes(currentUser?.id || '') ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                    <Heart className={`w-5 h-5 ${post.likedBy.includes(currentUser?.id || '') ? 'fill-current' : ''}`} />
                    <span className="font-bold">{post.likes} Likes</span>
                </button>
                <div className="flex items-center gap-2 text-slate-400 px-4 py-2">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-bold">{post.comments} Comments</span>
                </div>
             </div>
          </div>

          <div className="bg-slate-950/30 p-8">
              <h3 className="text-xl font-bold text-white mb-6">Discussion</h3>
              
              <div className="space-y-6 mb-8">
                  {post.commentList && post.commentList.length > 0 ? (
                      post.commentList.map((comment) => (
                          <div key={comment.id} className="flex gap-4 group">
                              <img src={comment.authorAvatar} className="w-10 h-10 rounded-lg bg-slate-800" />
                              <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                      <span className="font-bold text-white text-sm">{comment.authorName}</span>
                                      <span className="text-xs text-slate-600">{new Date(comment.timestamp).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-slate-400 text-sm leading-relaxed">{comment.content}</p>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="text-center py-10 border-2 border-dashed border-slate-800 rounded-2xl">
                          <p className="text-slate-500 font-medium">No comments yet. Be the first!</p>
                      </div>
                  )}
              </div>

              <form onSubmit={handleSubmitComment} className="flex gap-4">
                  <img src={currentUser?.avatar} className="w-10 h-10 rounded-lg bg-slate-800 hidden md:block" />
                  <div className="flex-1 flex gap-2">
                      <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add to the discussion..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 text-white focus:border-cyan-500 outline-none transition-colors"
                      />
                      <button 
                        type="submit"
                        disabled={!newComment.trim()}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
                      >
                          <Send className="w-5 h-5" />
                      </button>
                  </div>
              </form>
          </div>
       </div>
    </div>
  );
};

export default PostView;