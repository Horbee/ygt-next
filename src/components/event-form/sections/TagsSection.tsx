import CreatableAsyncSelect from "react-select/async-creatable";

import { Input } from "@mantine/core";

import { useDebounce, UseEventForm } from "../../../hooks";
import { api } from "../../../utils/api";
import { ReactSelectWrapper } from "../../fields";

interface Props {
  eventForm: UseEventForm;
}

export const TagsSection = ({ eventForm }: Props) => {
  const { control } = eventForm;
  const findTags = api.event.getDistinctTags.useMutation();

  const debouncedFindTags = useDebounce(findTags.mutateAsync);

  return (
    <Input.Wrapper label="Tags">
      <ReactSelectWrapper
        as={CreatableAsyncSelect<{ label: string; value: string }, true>}
        placeholder="Add some tags..."
        control={control}
        isMulti
        fieldName="tags"
        loadOptions={(searchTerm) => debouncedFindTags(searchTerm)}
      />
    </Input.Wrapper>
  );
};
