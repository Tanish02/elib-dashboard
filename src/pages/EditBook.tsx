import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderPinwheel, Trash, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBook, updateBook } from "@/http/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  author: z
    .string()
    .min(2, {
      message: "Author must be at least 2 characters.",
    })
    .max(20, {
      message: "Author must be at most 20 characters.",
    }),
  genre: z.string().min(2, {
    message: "Genre must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 10 characters.",
  }),
  coverImage: z.instanceof(FileList).optional(),
  file: z.instanceof(FileList).optional(),
});

const EditBook = () => {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      genre: "",
      description: "",
    },
  });

  const coverImageRef = form.register("coverImage");
  const fileRef = form.register("file");

  const QueryClient = useQueryClient();

  // Fetch book data
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

  // Update form with fetched data
  useEffect(() => {
    if (bookData) {
      form.reset({
        title: bookData.title,
        author: bookData.author,
        genre: bookData.genre,
        description: bookData.description,
      });
    }
  }, [bookData, form]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      if (!bookId) throw new Error("Book ID is required");
      return updateBook(bookId, data);
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["books"] });
      QueryClient.invalidateQueries({ queryKey: ["book", bookId] });

      console.log("Book updated successfully");
      navigate("/dashboard/books");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formdata = new FormData();
    formdata.append("title", values.title);
    formdata.append("author", values.author);
    formdata.append("genre", values.genre);
    formdata.append("description", values.description);

    // Only append files if they are selected
    if (values.coverImage && values.coverImage.length > 0) {
      formdata.append("coverImage", values.coverImage[0]);
    }
    if (values.file && values.file.length > 0) {
      formdata.append("file", values.file[0]);
    }

    mutation.mutate(formdata);
    console.log(values);
  }

  if (isLoading) {
    return <div>Loading book data...</div>;
  }

  if (isError) {
    return <div>Error fetching book data</div>;
  }

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  <BreadcrumbPage>Edit</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-4">
              <Link to="/dashboard/books">
                <Button variant={"outline"}>
                  <Trash />
                  <span className="ml-2">Discard</span>
                </Button>
              </Link>

              <Button type="submit" disabled={mutation.isPending}>
                <Upload />
                {mutation.isPending && (
                  <LoaderPinwheel className="animate-spin" />
                )}
                <span className="ml-2">Update</span>
              </Button>
            </div>
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Edit Book</CardTitle>
              <CardDescription>
                Update the details below to modify the book information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input type="text" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="w-full"
                          maxLength={20}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <FormControl>
                        <Input type="text" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-32" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverImage"
                  render={() => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          className="w-full"
                          {...coverImageRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>Book File</FormLabel>
                      <FormControl>
                        <Input type="file" className="w-full" {...fileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </section>
  );
};

export default EditBook;
