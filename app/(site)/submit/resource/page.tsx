import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SubmitResourcePage = () => {
  async function action(data: FormData) {
    'use server';

    console.log({
      title: data.get('title'),
      type: data.get('type'),
      url: data.get('url'),
    });
  }

  return (
    <>
      <h2 className="my-6 text-center text-4xl font-bold">Submit a resource</h2>
      <p className="mx-auto mb-6 max-w-md text-center">
        👋 Hello good person! We appreciate your willingness to submit a
        resource and contribute to the growth of the Frontend Digest initative.
        Please fill in the form below.
      </p>

      <form className="mx-auto flex max-w-sm flex-col gap-4" action={action}>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" type="text" />
        </div>
        <Select name="type">
          <SelectTrigger>
            <SelectValue placeholder="Pick a resource type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Types</SelectLabel>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="podcast">Podcast</SelectItem>
              <SelectItem value="twitter-thread">Twitter Thread</SelectItem>
              <SelectItem value="github-thread">Github Thread</SelectItem>
              <SelectItem value="whatchamacallit">Whatchamacallit</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div>
          <Label htmlFor="url">URL</Label>
          <Input id="url" name="url" type="url" />
        </div>
        <Button type="submit">Submit 🚀</Button>
      </form>
    </>
  );
};

export default SubmitResourcePage;
