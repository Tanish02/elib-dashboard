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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteBook, getBook } from "@/http/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoaderPinwheel, Trash, ArrowLeft } from "lucide-react";
import { useState } from "react";

const DeleteBook = () => {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const queryClient = useQueryClient();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  console.log("DeleteBook component rendered");
  console.log("Book ID from params:", bookId);

  const {
    data: bookData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      console.log("Fetching book data for ID:", bookId);
      if (!bookId) {
        console.error("Book ID is required for fetching book data");
        throw new Error("Book ID is required");
      }
      const response = await getBook(bookId);
      console.log("Book data fetched successfully:", response.data);
      return response.data;
    },
    enabled: !!bookId,
  });

  // Log query state changes
  console.log(
    "Query state - isLoading:",
    isLoading,
    "isError:",
    isError,
    "bookData:",
    bookData
  );

  const mutation = useMutation({
    mutationFn: async () => {
      console.log("Starting delete mutation for book ID:", bookId);
      if (!bookId) {
        console.error("Book ID is required for deletion");
        throw new Error("Book ID is required");
      }
      console.log("Calling deleteBook API...");
      const response = await deleteBook(bookId);
      console.log("Delete API response:", response);
      return response;
    },
    onSuccess: (data) => {
      console.log("Book deleted successfully:", data);
      console.log("Invalidating books query cache...");
      queryClient.invalidateQueries({ queryKey: ["books"] });
      console.log("Showing success dialog...");
      setShowSuccessDialog(true);
    },
    onError: (error) => {
      console.error("Error deleting book:", error);
      console.log("Setting error message and showing error dialog...");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete book. Please try again."
      );
      setShowErrorDialog(true);
    },
  });

  const handleDelete = () => {
    console.log("Delete button clicked");
    console.log("Starting mutation...");
    mutation.mutate();
  };

  const handleSuccessDialogClose = () => {
    console.log("Success dialog closed, navigating to books page...");
    setShowSuccessDialog(false);
    navigate("/dashboard/books");
  };

  const handleErrorDialogClose = () => {
    console.log("Error dialog closed");
    setShowErrorDialog(false);
    setErrorMessage("");
  };

  if (isLoading) {
    console.log("Rendering loading state");
    return <div>Loading Book...</div>;
  }

  if (isError) {
    console.log("Rendering error state");
    return <div>Error fetching Book</div>;
  }

  console.log("Rendering main component with book data:", bookData);

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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={mutation.isPending}>
                <Trash />
                {mutation.isPending && (
                  <LoaderPinwheel className="animate-spin" />
                )}
                <span className="ml-2">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  book "{bookData?.title}" and remove all associated data
                  including the cover image and book file.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="">
                  Delete Book
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Book Deleted Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              The book "{bookData?.title}" has been permanently deleted from the
              system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSuccessDialogClose}>
              Go to Books
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Failed</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage ||
                "An error occurred while trying to delete the book. Please try again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleErrorDialogClose}>
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default DeleteBook;
