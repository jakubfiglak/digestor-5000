import { SubmitResourceForm } from '@/modules/resources/components/submit-resource-form';

const SubmitResourcePage = () => {
  return (
    <>
      <h2 className="my-6 text-center text-4xl font-bold">Submit a resource</h2>
      <p className="mx-auto mb-6 max-w-md text-center">
        👋 Hello good person! We appreciate your willingness to submit a
        resource and contribute to the growth of the Frontend Digest initative.
        Please fill in the form below.
      </p>

      <SubmitResourceForm className="mx-auto max-w-sm" />
    </>
  );
};

export default SubmitResourcePage;
