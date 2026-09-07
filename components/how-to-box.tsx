interface Props {
  title: string;
  subtitle: string;
  content: string;
}

export const HowToBox = (props: Props) => {
  const { title, subtitle, content } = props;
  return (
    <div className="flex flex-col w-full gap-2 border-l-2 border-primary pl-6">
      <h1 className="text-primary text-4xl font-heading">{title}</h1>
      <h2 className="text-foreground text-3xl font-heading">{subtitle}</h2>
      <p className="text-muted-foreground font-sans pt-6">{content}</p>
    </div>
  );
};
