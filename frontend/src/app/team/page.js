import { redirect } from 'next/navigation';

// The team section now lives on the homepage.
export default function TeamRedirect() {
  redirect('/#team');
}
