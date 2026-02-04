import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  return <Button onClick={() => toast.success('clicked')}>Click me</Button>;
}
