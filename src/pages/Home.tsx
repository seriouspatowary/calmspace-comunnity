import { Post } from "@/__components/Post"
import { PostList } from "@/__components/PostList"



const Home = () => {
  return (
    <div className="flex flex-col min-h-screen px-4 py-8 space-y-6">
      <PostList />
      <Post />
    </div>
  );
}


export default Home