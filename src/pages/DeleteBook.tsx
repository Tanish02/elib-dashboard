import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteBook, getBook } from "@/http/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";

const DeleteBook = () => {
  const Navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const QueryClient = useQueryClient();

  const {
    data: bookData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getBook(bookId!),
    enabled: !!bookId,
  });

  const mutation = useMutation({
    mutationFn: () => deleteBook(bookId!),
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["books"] });
      Navigate("/dashboard/books");
    },
  });

  const handleDelete = () => {
    const confirmDelete = confirm("Are you sure you want to delete this book?");
    if (confirmDelete) {
      mutation.mutate();
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading book.</div>;

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Delete Book</CardTitle>
          <CardDescription>
            Are you sure you want to delete this book
            <strong>{bookData.title}</strong>?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Link to="/dashboard/books">
            <Button variant="outline">Discard</Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  );
};

export default DeleteBook;

// end code
