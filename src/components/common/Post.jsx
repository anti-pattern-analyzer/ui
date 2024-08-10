import React from "react";

const Post = ({ post, onLike, onBookmark }) => {
    return (
        <div className="border rounded-lg overflow-hidden shadow-lg mb-4">
            <div className="px-4 py-2 bg-gray-100 border-b">
                <h3 className="font-bold">{post.user.name}</h3>
            </div>
            <img src={post.photo_url} alt="Sky" className="w-full"/>
            <div className="p-4">
                <p>{post.caption}</p>
                <div className="flex items-center justify-between mt-2">
                    <button onClick={() => onLike(post.id)}
                            className={`text-sm ${post.isLiked ? 'text-red-600' : 'text-gray-600'}`}>
                        ❤️ {post.likes_count} likes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Post;
