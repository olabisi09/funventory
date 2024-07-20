interface EmptyProps {
  heading?: string;
  description?: string;
  cta?: React.ReactNode;
}

const Empty = (props: EmptyProps) => {
  const {
    heading = "No data available",
    description = "Nothing to see here yet.",
    cta,
  } = props;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">{heading}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        {cta}
      </div>
    </main>
  );
};

export { Empty };
