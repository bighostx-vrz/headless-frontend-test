export default function HtmlBlock({ data }: { data: any }) {
  if (!data?.code) return null;

  // React requires you to intentionally bypass security to render raw HTML
  return (
    <div 
      style={{ margin: "40px 0" }} 
      dangerouslySetInnerHTML={{ __html: data.code }} 
    />
  );
}