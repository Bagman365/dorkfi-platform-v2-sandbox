import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const SharePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const action = searchParams.get('action');
  const asset = searchParams.get('asset');
  const amount = searchParams.get('amount');
  
  // Construct dynamic meta tags based on transaction
  const title = `${action} ${amount} ${asset} on DorkFi`;
  const description = `Check out my transaction on DorkFi!`;
  const imageUrl = `/lovable-uploads/share-template.png`; // This would be dynamically generated
  
  useEffect(() => {
    // Redirect to home after a brief moment
    const timer = setTimeout(() => navigate('/'), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <p className="text-muted-foreground">Redirecting to DorkFi...</p>
        </div>
      </div>
    </>
  );
};

export default SharePage;
