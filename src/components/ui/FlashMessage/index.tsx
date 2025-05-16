import { getFlash } from '@/actions/flash';
import FlashMessageClient from './FlashMessageClient';
import { v4 as uuid } from 'uuid';

export default async function FlashMessage() {
  try {
    const flashData = await getFlash();

    if (!flashData) {
      return null;
    }

    return (
      <FlashMessageClient
        key={uuid()}
        type={flashData.type}
        message={flashData.message}
      />
    );
  } catch (error) {
    console.error('Error in FlashMessage component:', error);
    return null;
  }
}
