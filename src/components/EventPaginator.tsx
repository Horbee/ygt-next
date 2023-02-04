import { useMemo } from "react"

import { Pagination } from "@mantine/core"

type Props = {
  page: number;
  setPage: (value: number) => void;
  totalCount: number;
  pageSize: number;
};

export const EventPaginator = ({
  page,
  setPage,
  totalCount,
  pageSize,
}: Props) => {
  const totalPages = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount]
  );

  return (
    <Pagination
      page={page}
      onChange={setPage}
      total={totalPages}
      position="center"
      styles={(theme) => ({
        item: {
          "&[data-active]": {
            backgroundImage: theme.fn.gradient({ from: "red", to: "yellow" }),
          },
        },
      })}
    />
  );
};
