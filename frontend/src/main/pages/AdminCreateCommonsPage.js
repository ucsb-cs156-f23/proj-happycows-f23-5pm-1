import React, { useEffect, useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CommonsForm from "main/components/Commons/CommonsForm";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useBackendMutation, useBackend } from "main/utils/useBackend";

const AdminCreateCommonsPage = () => {
  const [defaultValues, setDefaultValues] = useState(null);

  const { data: defaultValuesData } = useBackend("/api/commons/defaults", {
    method: "GET",
    url: "/api/commons/defaults",
  });

  useEffect(() => {
    if (defaultValuesData) {
      setDefaultValues(defaultValuesData);
    }
  }, [defaultValuesData]);

  const objectToAxiosParams = (newCommons) => ({
    url: "/api/commons/new",
    method: "POST",
    data: newCommons,
  });

  const onSuccess = (commons) => {
    toast(
      <div>
        Commons successfully created!
        <br />
        {`id: ${commons.id}`}
        <br />
        {`name: ${commons.name}`}
        <br />
        {`startDate: ${commons.startingDate}`}
        <br />
        {`cowPrice: ${commons.cowPrice}`}
        <br />
        {`capacityPerUser: ${commons.capacityPerUser}`}
        <br />
        {`carryingCapacity: ${commons.carryingCapacity}`}
      </div>
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    ["/api/commons/all"]
  );

  const submitAction = async (data) => {
    mutation.mutate(data);
  };

  if (mutation.isSuccess) {
    return <Navigate to="/" />;
  }

  return (
    <BasicLayout>
      <h2>Create Commons</h2>
      {defaultValues && (
        <CommonsForm submitAction={submitAction} initialCommons={defaultValues} />
      )}
    </BasicLayout>
  );
};

export default AdminCreateCommonsPage;
