import { SubmitResourceForm } from '@/modules/resources/components/submit-resource-form';
import { SubmitResourceWelcomeCard } from '@/modules/resources/components/submit-resource-welcome-card';

const SubmitResourcePage = () => {
  return (
    <>
      <h2 className="my-6 text-center text-4xl font-bold">Submit a resource</h2>
      <SubmitResourceWelcomeCard className="mx-auto mb-6 max-w-md" />
      <SubmitResourceForm className="mx-auto max-w-sm" />
    </>
  );
};

export default SubmitResourcePage;
