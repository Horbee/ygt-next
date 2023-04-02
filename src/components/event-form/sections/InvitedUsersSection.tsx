import AsyncSelect from "react-select/async";

import { Input } from "@mantine/core";
import { User } from "@prisma/client";

import { useDebounce, UseEventForm } from "../../../hooks";
import { api } from "../../../utils/api";
import { ReactSelectWrapper } from "../../fields";

interface Props {
  eventForm: UseEventForm;
}

export const InvitedUsersSection = ({ eventForm }: Props) => {
  const { watch, control } = eventForm;
  const findUser = api.user.findAllByName.useMutation();

  const debouncedFindUser = useDebounce(findUser.mutateAsync);

  const isPublic = watch("public");

  return isPublic ? null : (
    <Input.Wrapper label="Invited Users">
      <ReactSelectWrapper
        as={AsyncSelect<User, true>}
        control={control}
        fieldName="invitedUsers"
        noOptionsMessage={() => "⚡ Type away and refine your search ⚡"}
        isMulti
        placeholder="Add some users..."
        loadOptions={(name) => debouncedFindUser(name.trim())}
        getOptionLabel={(opt) => opt.name ?? ""}
        getOptionValue={(opt) => opt.id}
      />
    </Input.Wrapper>
  );
};
