import { ScaffoldArticleDescriptionCard } from '@/modules/articles/components/scaffold-article-description-card';
import { ScaffoldArticleForm } from '@/modules/articles/components/scaffold-article-form';

const SubmitResourcePage = () => {
  return (
    <>
      <h2 className="my-6 text-center text-4xl font-bold">
        Scaffold an article
      </h2>
      <ScaffoldArticleDescriptionCard className="mx-auto mb-6 max-w-md" />
      <ScaffoldArticleForm className="mx-auto max-w-sm" />
    </>
  );
};

export default SubmitResourcePage;
