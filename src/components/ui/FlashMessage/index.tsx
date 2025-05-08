import { getFlash } from '@/actions/getFlash';
import FlashMessageClient from './FlashMessageClient';

export default async function FlashMessage() {
  try {
    const flashData = await getFlash();

    if (!flashData) {
      return null;
    }

    return (
      <FlashMessageClient
        type={flashData.type}
        message={flashData.message}
      />
    );
  } catch (error) {
    console.error('Error in FlashMessage component:', error);
    return null;
  }
}
