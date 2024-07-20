const Text = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type?: "h1" | "h2" | "h3" | "h4";
}) => {
  switch (type) {
    case "h1":
      return (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {children}
        </h4>
      );
    default:
      return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
  }
};

export { Text };
