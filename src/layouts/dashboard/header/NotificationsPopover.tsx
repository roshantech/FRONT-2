import { noCase } from 'change-case';
import { useEffect, useState } from 'react';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/useAuthContext';
// @mui
import {
  Box,
  Stack,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// _mock_
import { _notifications } from '../../../_mock/arrays';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------
interface EaNotification {
  ID?: number; 
  UserID: number;
  NotifyMsg: string;
  Status: StatusEnum;
  RecordTimestamp: string;
}
type StatusEnum = 'Unread' | 'Read';

export default function NotificationsPopover() {
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const { user } = useAuthContext();

  // const [notifications, setNotifications] = useState(_notifications);

  const [notifications, setNotifications] = useState<EaNotification[]>([]);

  const totalUnRead = notifications !== null ? notifications.filter((item) => item.Status === "Unread").length : 0;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };
  const sendDataToWebSocket = (data:any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  };
  const { enqueueSnackbar } = useSnackbar();

 
  useEffect(() => { 
    axiosInstance
    .get(`/core/getAllNotifications?Id=${user?.ID}`)
    .then((response) => {
      if(response.data !== null ){
        
        setNotifications(response.data.reverse() as EaNotification[]);
      }
    })
    .catch((error) => {
      enqueueSnackbar(error, { variant: 'error' });
    });
  },[enqueueSnackbar, user?.ID])

  useEffect(() => { 
 
    const newSocket = new WebSocket("ws://localhost:3001/v1/core/ws");
    setSocket(newSocket)
    newSocket.addEventListener("open", () => {
      console.log("WebSocket connection established")
    });
    newSocket.addEventListener("message", (event) => {
      console.log("Received message:", JSON.parse(event.data));
      const data = JSON.parse(event.data) as EaNotification;
      setNotifications([data,...notifications]);
    });

    newSocket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });

    newSocket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
    });

    return () => {
      newSocket.close();
    };
  }, [notifications]);

  return (
    <>
      <IconButtonAnimate
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 360, p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {/* {notifications.slice(0, 2).map((notification) => (
              <NotificationItem key={notification.ID} notification={notification} />
            ))} */}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {/* {notifications.slice(2, 5).map((notification) => (
              <NotificationItem key={notification.ID} notification={notification} />
            ))} */}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

type NotificationItemProps = {
  id: string;
  title: string;
  description: string;
  avatar: string | null;
  type: string;
  createdAt: Date;
  isUnRead: boolean;
};

function NotificationItem({ notification }: { notification: NotificationItemProps }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Stack direction="row" sx={{ mt: 0.5, typography: 'caption', color: 'text.disabled' }}>
            <Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} />
            <Typography variant="caption">{fToNow(notification.createdAt)}</Typography>
          </Stack>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: NotificationItemProps) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.description)}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/notification/ic_package.svg" />,
      title,
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/notification/ic_shipping.svg" />,
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/notification/ic_mail.svg" />,
      title,
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/notification/ic_chat.svg" />,
      title,
    };
  }
  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}
