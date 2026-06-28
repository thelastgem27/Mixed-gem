import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/lib/i18n/context';

interface LoadMoreProps {
  cursor: string;
}

export function LoadMore({ cursor }: LoadMoreProps) {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          setLoading(true);
          const params = new URLSearchParams(window.location.search);
          params.set('cursor', cursor);
          navigate(`?${params.toString()}`);
          setLoading(false);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, cursor, loading, navigate]);

  return (
    <div ref={setRef} className="py-4 text-center">
      {loading ? (
        <span className="text-gray-500">{t('common.loading')}</span>
      ) : (
        <div className="h-10" />
      )}
    </div>
  );
}
