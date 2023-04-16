import { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { useUser } from "../context/AuthContext";
import { listPosts } from "../graphql/queries";
import { API } from "aws-amplify";
import { Post, ListPostsQuery } from "../API";

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPostsFromApi = async (): Promise<Post[]> => {
      try {
        const allPosts = (await API.graphql({
          query: listPosts,
        })) as {
          data: ListPostsQuery;
          errors: any[];
        };

        console.log(allPosts);

        if (allPosts.data) {
          setPosts(allPosts.data.listPosts.items as Post[]);
          return allPosts.data.listPosts.items as Post[];
        } else {
          throw new Error("Could not get posts.");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPostsFromApi();
  }, []);

  console.log("User:", user);
  console.log("Posts:", posts);
  return <Typography variant="h1">Hello world!</Typography>;
}
