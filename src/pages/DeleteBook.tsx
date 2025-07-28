import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deleteBook, getBook } from "@/http/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoaderPinwheel, Trash, ArrowLeft } from "lucide-react";

const DeleteBook = () => {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const queryClient = useQueryClient();

  const {
    data: bookData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      if (!bookId) throw new Error("Book ID is required");
      const response = await getBook(bookId);
      return response.data;
    },
    enabled: !!bookId,
  });

  const mutation = useMutation({
    mutationFn: () => {
      if (!bookId) throw new Error("Book ID is required");
      return deleteBook(bookId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      navigate("/dashboard/books");
    },
  });

  const handleDelete = () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this book? This action cannot be undone."
    );
    if (confirmDelete) {
      mutation.mutate();
    }
  };

  if (isLoading) {
    return <div>Loading Book...</div>;
  }

  if (isError) {
    return <div>Error fetching Book</div>;
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/books">Books</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Delete</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-4">
          <Link to="/dashboard/books">
            <Button variant={"outline"}>
              <ArrowLeft />
              <span className="ml-2">Discard</span>
            </Button>
          </Link>

          <Button onClick={handleDelete} disabled={mutation.isPending}>
            <Trash />
            {mutation.isPending && <LoaderPinwheel className="animate-spin" />}
            <span className="ml-2">Delete</span>
          </Button>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Delete Book</CardTitle>
          <CardDescription>
            Review the book details below. Once deleted, this action cannot be
            undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                className="w-full"
                value={bookData?.title || ""}
                readOnly
                disabled
              />
            </div>

            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                type="text"
                className="w-full"
                value={bookData?.author || ""}
                readOnly
                disabled
              />
            </div>

            <div>
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                type="text"
                className="w-full"
                value={bookData?.genre || ""}
                readOnly
                disabled
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                className="min-h-32"
                value={bookData?.description || ""}
                readOnly
                disabled
              />
            </div>

            {bookData?.coverImage && (
              <div>
                <Label>Cover Image</Label>
                <div className="mt-2">
                  <img
                    src={bookData.coverImage}
                    alt={`Cover of ${bookData.title}`}
                    className="max-w-xs max-h-48 object-cover rounded-md border"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="createdAt">Created At</Label>
              <Input
                id="createdAt"
                type="text"
                className="w-full"
                value={
                  bookData?.createdAt
                    ? new Date(bookData.createdAt).toLocaleDateString()
                    : ""
                }
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start">
              <Trash className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Warning: This action is irreversible
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  Deleting this book will permanently remove it from the system.
                  All associated data including the cover image and book file
                  will be lost.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DeleteBook;
