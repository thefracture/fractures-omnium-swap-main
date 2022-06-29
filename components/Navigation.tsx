import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CachedIcon from '@mui/icons-material/Cached';
import { Button, ButtonBase, Grid, List } from '@mui/material';
import { Box, styled } from '@mui/system';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  useWalletModal,
  WalletDisconnectButton,
} from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { useState } from 'react';

interface IProps {
  refreshBtn?: () => void;
}

export const Navigation = ({ refreshBtn }: IProps) => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  return (
    <Box sx={{ pb: 2, pt: 3, mx: 15 }} component='nav'>
      <Grid container>
        <Grid
          sx={{
            textAlign: { xs: 'right', sm: 'center', md: 'left', lg: 'left' },
          }}
          item
          sm={12}
          md={4}
          lg={4}
        >
          <Link href='/'>
            <Box
              sx={{
                maxWidth: '230px',
              }}
              component='img'
              src='/logo.png'
            />
          </Link>
        </Grid>
        <Grid item sm={12} md={8} lg={8}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              sx={{
                display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' },
              }}
            >
              <Menu
                hasRefresh={false}
                refreshBtn={refreshBtn}
                setOpenMobileMenu={setOpenMobileMenu}
              />
            </Box>
            {/* Mobile Menu */}
            <Box
              sx={{
                span: {
                  width: '43px',
                  height: '4px',
                  backgroundColor: '#fff',
                  margin: '7px 0',
                  display: 'flex',
                },
                cursor: 'pointer',
                position: 'absolute',
                left: 25,
                top: 45,
                zIndex: 99,
                display: { xs: 'block', sm: 'block', md: 'none', lg: 'none' },
              }}
              onClick={() => setOpenMobileMenu(true)}
            >
              <span />
              <span />
              <span />
            </Box>

            <Box
              sx={{
                backgroundColor: '#140c0ce8',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                position: 'fixed',
                zIndex: 9999,
                height: '100%',
                width: '100%',
                top: 0,
                left: 0,
                transition: 'all cubic-bezier(0.25, 1, 1, 1) .5s',
                marginLeft: openMobileMenu ? 0 : '-5000%',

                '& ul': {
                  flexDirection: 'column',
                  marginTop: '150px',

                  '& li': {
                    padding: '10px 80px',
                  },
                  '& button': {
                    padding: '10px 80px',
                  },
                },
              }}
            >
              <Box
                component='svg'
                sx={{
                  position: 'absolute',
                  right: 40,
                  top: 30,
                  height: 30,
                  width: 30,
                }}
                onClick={() => setOpenMobileMenu(false)}
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 50 50'
                overflow='visible'
                stroke='white'
                strokeWidth='10'
                strokeLinecap='round'
              >
                <line x2='50' y2='50' />
                <line x1='50' y2='50' />
              </Box>
              <Menu
                hasRefresh={false}
                refreshBtn={refreshBtn}
                setOpenMobileMenu={setOpenMobileMenu}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
// @ts-ignore
const Menu = ({ refreshBtn, setOpenMobileMenu, hasRefresh }) => {
  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const ConnectingBox = styled(Box)({
    button: {
      borderRadius: 0,
      padding: '10px 20px',
      backgroundColor: '#e1dad773',
      fontSize: '20px',
      height: 'inherit',
      lineHeight: 'inherit',
      fontFamily: 'SandeMore-Regular!important',
      fontWeight: 700,

      '&:hover': { backgroundColor: '#b1b1b173 !important' },
      span: {
        color: '#fff',
        fontSize: '20px',
      },
    },
  });
  return (
    <List
      sx={{
        display: 'flex',
        gap: 2,
        fontSize: 20,
        li: {
          padding: '5px 15px',
          backgrounColor: '#e1dad742',
          margin: '0',
        },
      }}
    >
      {connected && hasRefresh && (
        <ButtonBase
          component='li'
          sx={{
            opacity: 1,
            backgroundImage:
              'linear-gradient(#8de5ff 2px, transparent 2px),linear-gradient(90deg, #b3b9b8 2px, transparent 2px),linear-gradient(#bfbfbf 1px, transparent 1px),linear-gradient(90deg, #bfbfbf 1px, #afafaf 1px)',
            backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
            backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px',
            backgroundColor: '#6EC1E4 !important',
            color: '#000 !important',
          }}
          onClick={() => {
            refreshBtn();
            setOpenMobileMenu(false);
          }}
        >
          <CachedIcon sx={{ mr: 1, fontSize: '1.8rem' }} />
          Refresh
        </ButtonBase>
      )}
      <ConnectingBox onClick={() => setOpenMobileMenu(false)}>
        {connected ? (
          <WalletDisconnectButton>Disconnect</WalletDisconnectButton>
        ) : (
          <Button onClick={() => setVisible(true)}>Connect</Button>
        )}
      </ConnectingBox>

      {publicKey && (
        <>
          <ButtonBase component='li'>
            <AccountBalanceWalletIcon sx={{ mr: 1, fontSize: '1.8rem' }} />
            {publicKey?.toString().substring(0, 4)}...
            {publicKey
              ?.toString()
              .substring(
                publicKey?.toString().length - 2,
                publicKey?.toString().length
              )}
          </ButtonBase>
        </>
      )}
    </List>
  );
};
