import { Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CustomerAPI, { HotlineGroups } from 'app/api/customer.api';
import {
  convertStringToArray,
  getDifferenceTwoArray,
} from 'app/helpers/array.helper';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import addToast from 'shared/blocks/toastify/add-toast.component';
import { Message } from 'shared/const/message.const';
import useHotlineGroupDialog from '../../components/hotline-group-dialog/hotline-group-dialog.component';
import '../../shared/styles/detail-page.style.scss';
import { HotlineGroupInfo } from '../../shared/type/customer.type';
import { GroupHotlineForm } from '../../shared/type/hotline-group-dialog.type';

function HotlineDetailPage() {
  const { customerId, hotlineGroupId } = useParams();
  const hotlineDetailInfo = useRef<HotlineGroupInfo>();
  const [loading, setLoading] = useState<boolean>(false);
  const { HotlineGroupDialog, closeHotlineGroup, openHotlineGroup } =
    useHotlineGroupDialog();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'id', headerName: 'STT', flex: 0.3, sortable: false },
    {
      field: 'hotlineGroupName',
      headerName: 'Tên nhóm Hotline',
      flex: 1,
      sortable: false,
    },
    {
      field: 'stringHotline',
      headerName: 'Số Hotline',
      flex: 1,
      sortable: false,
    },
    {
      field: 'action',
      headerName: 'Chức năng',
      flex: 1,
      sortable: false,
      renderCell: (cellValues) => (
        <CellAction
          viewAble={false}
          deleteAble={false}
          handleEdit={() => handleEdit(cellValues.row)}
        />
      ),
    },
  ]).current;

  const onUpdate = async (data: GroupHotlineForm) => {
    const { groupHotlineName, hotline, status } = data;
    const callAPI = [];
    if (groupHotlineName !== hotlineDetailInfo.current?.hotlineGroupName) {
      callAPI.push(() => {
        CustomerAPI.updateHotlineGroup({
          groupHotlineName,
          customerId: hotlineDetailInfo.current?.customerId || 0,
          hotlineGroupId: hotlineDetailInfo.current?.hotlineGroupId || 0,
        });
      });
    }

    if (status !== hotlineDetailInfo.current?.groupStatus) {
      callAPI.push(() => {
        CustomerAPI.updateHotlineGroup({
          status,
          customerId: hotlineDetailInfo.current?.customerId || 0,
          hotlineGroupId: hotlineDetailInfo.current?.hotlineGroupId || 0,
        });
      });
    }

    if (hotline?.length) {
      const arrayHotline = hotline.map(
        (hotlineItem) => hotlineItem.label || hotlineItem
      );
      const initialArayHotline =
        hotlineDetailInfo.current?.hotlines.map((item) => item.isdn) || [];

      const deleteHotlines = getDifferenceTwoArray(
        initialArayHotline,
        arrayHotline
      );
      const addHotlines = getDifferenceTwoArray(
        arrayHotline,
        initialArayHotline
      );

      if (addHotlines.length) {
        callAPI.push(() => {
          CustomerAPI.updateHotlineGroup({
            isdns: addHotlines,
            customerId: hotlineDetailInfo.current?.customerId || 0,
            hotlineGroupId: hotlineDetailInfo.current?.hotlineGroupId || 0,
          });
        });
      }

      if (deleteHotlines.length) {
        deleteHotlines.forEach((deleteItem) => {
          const findHotline = hotlineDetailInfo.current?.hotlines.find(
            (item) => item.isdn === deleteItem
          );
          callAPI.push(() => {
            CustomerAPI.activeHotline(String(findHotline?.hotlineId), 0);
          });
        });
      }
    }

    try {
      if (callAPI.length) {
        setLoading(true);
        await Promise.all(callAPI.map((api) => api()));
        await getHotlineDetail();
        addToast({ message: Message.UPDATE_SUCCESS, type: 'success' });
      }
      closeHotlineGroup();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleEdit = (initialValues: HotlineGroups) => {
    openHotlineGroup({
      initialValues,
      onSubmit: onUpdate,
      title: 'Cập nhập nhóm Hotline',
      isUpdate: true,
    });
  };

  const getHotlineDetail = useCallback(async () => {
    try {
      setLoading(true);
      const result = await CustomerAPI.getHotlineDetail(
        customerId || '',
        hotlineGroupId || ''
      );
      if (result) {
        hotlineDetailInfo.current = {
          ...result,
          id: 1,
          stringHotline:
            result?.hotlines.map((item) => item.isdn).join(', ') || '',
        };
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getHotlineDetail();
  }, [getHotlineDetail]);

  return (
    <>
      <Helmet>
        <title>Customer Detail Page</title>
      </Helmet>

      <LoadingComponent open={loading} />

      <Container maxWidth="xl" className="detail-page">
        <div className="data-grid">
          <DataGrid
            rows={hotlineDetailInfo.current ? [hotlineDetailInfo.current] : []}
            columns={COLUMN_CONFIG}
            rowHeight={200}
            autoHeight
            disableColumnMenu
            hideFooter
          />
        </div>
      </Container>

      <HotlineGroupDialog />
    </>
  );
}

export default HotlineDetailPage;
