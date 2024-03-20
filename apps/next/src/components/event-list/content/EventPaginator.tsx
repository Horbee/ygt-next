import { useMemo } from "react";

import { Pagination, useMantineTheme } from "@mantine/core";

type Props = {
  page: number;
  setPage: (value: number) => void;
  totalCount: number;
  pageSize: number;
};

export const EventPaginator = ({ page, setPage, totalCount, pageSize }: Props) => {
  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount]);
  const theme = useMantineTheme();

  return (
    <Pagination
      value={page}
      onChange={setPage}
      total={totalPages}
      position="center"
      styles={{
        control: {
          "&[data-active]": {
            backgroundImage: theme.fn.gradient({ from: "red", to: "yellow" }),
          },
        },
      }}
    />
  );
};
