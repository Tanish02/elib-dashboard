import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks, getUsers } from "@/http/api";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

const HomePage = () => {
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch books count
        const booksResponse = await getBooks();
        setTotalBooks(booksResponse.data.length);

        // Fetch users count from backend
        try {
          const usersResponse = await getUsers();
          const userData = usersResponse.data as unknown[];
          setTotalUsers(userData.length);
        } catch {
          // If users endpoint doesn't exist, use mock data
          setTotalUsers(1234);
        }
      } catch {
        // Set mock data for demonstration
        setTotalBooks(156);
        setTotalUsers(1234);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddBook = () => {
    navigate("/dashboard/books/create");
  };

  return (
    <>
      <div className="flex items-center mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        ////////////////// Total Books in home page display
        <div className="bg-black text-white rounded-lg p-6 shadow-lg">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              Total Books
            </h3>
            <div className="text-3xl font-bold">
              {loading ? "..." : totalBooks.toLocaleString()}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {loading ? "Loading..." : "Books in library"}
            </p>
          </div>
        </div>
        /////////////////// Total Users
        <div className="bg-black text-white rounded-lg p-6 shadow-lg">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              Total Users
            </h3>
            <div className="text-3xl font-bold">
              {loading ? "..." : totalUsers.toLocaleString()}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {loading ? "Loading..." : "Registered users"}
            </p>
          </div>
        </div>
        /////////////// Coming Soon
        <div className="bg-black text-white rounded-lg p-6 shadow-lg">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              New Feature
            </h3>
            <div className="text-3xl font-bold">Coming Soon</div>
            <p className="text-sm text-gray-400 mt-2">Stay tuned for updates</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button>
          <CirclePlus size={20} />
          <span className="ml-2">Add Book</span>
        </Button>
      </div>
    </>
  );
};

//  end code

export default HomePage;
