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
import { cn } from '@/lib/utils';

import { submitResourceAction } from '../actions';

type SubmitResourceFormProps = {
  className?: string;
};

export const SubmitResourceForm = ({ className }: SubmitResourceFormProps) => {
  return (
    <form
      className={cn('flex flex-col gap-4', className)}
      action={submitResourceAction}
    >
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
  );
};
