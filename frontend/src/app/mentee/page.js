import { redirect } from 'next/navigation';

// Old mentee login page. Everyone now signs in at /login.
export default function MenteeRedirect() {
  redirect('/login');
}
