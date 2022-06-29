import { Alert, Box, Container, Drawer, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { createTransaction, parseURL } from '@solana/pay';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import Blue from '../assets/blue.gif';
import fractureGif from '../assets/fracture.gif';
import Fracture from '../assets/fracture.png';
import Green from '../assets/green.gif';
import Omi from '../assets/omi.gif';
import plus from '../assets/plus.png';
import Purple from '../assets/purple.gif';
import QuestionSign from '../assets/question.svg';
import SwapIcon from '../assets/swap.svg';
import Yellow from '../assets/yellow.gif';
import { AnimatedButton } from '../components/animatedButton';
import { Navigation } from '../components/Navigation';
import { FracturesMetadata, getFracturesInWallet } from '../constants';

const endpoint = 'https://fractures-swap.solpatrol.io/rest/';
type SwapOrder = {
  id: number;
  nft: string;
  replacement: string;
  reference: string;
  createdAt: Date;
  endsAt: Date | null;
  status: any;
  swapTxid: string | null;
  ownerId: number | null;
};

export default function SwapHome(): ReactNode {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [listNft, setListNft] = useState<FracturesMetadata[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [hideInfoText, setHideInfoText] = useState(true);
  const [currentSelected, setCurrentSelected] = useState<null | {
    swapOrder: SwapOrder;
    url: string;
  }>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(0);
  const [addToSwapLoading, setAddToSwapLoading] = useState(false);
  const [alertHeight, setAlertHeight] = useState(90);
  const [omnium, setOmnium] = useState(Omi);

  const alertRef = useRef<any>(null);
  const handleClickList = async (index: number) => {
    setAddToSwapLoading(true);
    try {
      fetch(`${endpoint}swap/get-url/${listNft[index].mint}`)
        .then((res) => res.json())
        .then((data) => {
          setCurrentSelected(data);
          setAddToSwapLoading(false);
        });
    } catch (e) {
      console.log(e);
      setAddToSwapLoading(false);
    }
    // setAddToSwapLoading(false);
    setOpenDrawer(false);
  };

  const handleClickSwap = async () => {
    if (!currentSelected?.url || !wallet.publicKey || !wallet.sendTransaction)
      return;
    setLoading((l) => l + 1);

    const id = toast.loading('Event Started Please wait...');
    const { recipient, amount, splToken, reference, memo } = parseURL(
      currentSelected.url
    );

    const tx = await createTransaction(
      connection,
      wallet.publicKey,
      recipient,
      amount as any,
      {
        reference,
        memo,
        splToken,
      }
    ).catch((e) => {
      console.error(e);
      console.log(e);
      return null;
    });

    setLoading((l) => l - 1);

    if (!tx) {
      toast.update(id, {
        render:
          'Payment issue, check if you have enough Selected NFT and SOL (0.000005)',
        type: 'error',
        isLoading: false,
        closeOnClick: true,
        closeButton: true,
      });
      // alert(
      //   `Payment issue, check if you have enough Selected NFT and SOL (0.000005).`
      // );
      return;
    }
    const signature = await wallet.sendTransaction(tx, connection);

    await connection.confirmTransaction(signature, 'confirmed');

    setDone(true);
    toast.update(id, {
      render: 'Swap Confirmed!',
      type: 'success',
      isLoading: false,
      closeOnClick: true,
      closeButton: true,
    });
  };

  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => {
      if (done) {
        setDone(false);
        setCurrentSelected(null);
      }
    }, 2900);
    return () => clearTimeout(timer);
  }, [done]);

  useEffect(() => {
    if (!wallet?.publicKey) return setListNft([]);
    getFracturesInWallet(connection, wallet?.publicKey).then((nfts) =>
      setListNft(nfts)
    );
  }, [wallet?.publicKey]);

  const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const random = getRandomInt(0, 4);
  // console.log(rand);

  const handleCloseInfoText = () => {
    window.sessionStorage.setItem('infoText', 'true');
    setHideInfoText(true);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const infoText = window.sessionStorage.getItem('infoText');

      if (infoText) {
        setHideInfoText(true);
      } else {
        setHideInfoText(false);
      }

      if (alertRef.current) {
        //@ts-ignore
        setAlertHeight(alertRef.current.clientHeight);
      } else {
        setAlertHeight(90);
      }
    }
  }, [typeof window]);

  useEffect(() => {
    if (!done) return;
    if (done) {
      if (random === 1) {
        setOmnium(Green);
        return;
      } else if (random === 2) {
        setOmnium(Blue);
        return;
      } else if (random === 3) {
        setOmnium(Purple);
        return;
      } else if (random === 4) {
        setOmnium(Yellow);
        return;
      } else {
        setOmnium(Omi);
      }
    }
  }, [done]);

  return (
    <Box
      sx={{
        backgroundImage: `url(/bg.png)`,
        backgroundPosition: 'bottom right',
        color: '#fff',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        position: 'relative',
        transition: '.3s',
        backgroundAttachment: 'fixed',
        zIndex: 1,
        overflowX: 'hidden',

        '& .MuiDrawer-paper': {
          background: '#ffbbbb21 !important',
          backdropFilter: 'blur(10px) !important',
        },
      }}
    >
      <Alert
        ref={alertRef}
        severity='info'
        onClose={handleCloseInfoText}
        sx={{
          borderRadius: 0,
          color: 'rgb(255 255 255)',
          backgroundColor: 'rgb(132 205 217 / 13%)',
          backdropFilter: 'blur(10px)',
          fontSize: '18px',
          fontFamily: 'SandeMore-Regular !important',
          fontWeight: 700,
          marginTop: hideInfoText ? `-${alertHeight}px` : '0',
          transition: 'all linear .3s',
        }}
      >
        Once a Fracture enters the event horizon, Omnium particles are gathered
        from the nebula. Infinite pressure forces them together, forming a
        perfect crystalline structure. Each element is created over time, and
        released in 10 minute intervals. It can take up to 20 minutes to reach
        your wallet, please be patient.
      </Alert>
      <Navigation />
      <Box sx={{ textAlign: 'center', pt: 10, pb: 3 }}>
        <Typography
          variant='h2'
          sx={{
            fontWeight: '900 !important',
            fontFamily: 'SandeMore-Regular !important',
            lineHeight: '1 !important',
            marginBottom: '-8px !important',
          }}
          className='glitch'
          data-text='The Event Horizon'
        >
          The Event Horizon
        </Typography>
        <Typography
          sx={{ fontSize: '28px !important' }}
          className='glitch'
          data-text='The Fracture Evolution'
        >
          The Fracture Evolution
        </Typography>
      </Box>

      <Container>
        {/* <Grid item lg={12}> */}
        <Box
          sx={{
            display: 'grid',
            gap: '20px',
            gridTemplateColumns: '5fr 4fr 5fr',
            maxWidth: '85%',
            margin: '50px auto 0',
          }}
        >
          <Box
            sx={{
              height: '320px',
              backgroundColor: '#ffffff0d',
              backdropFilter: 'blur(10px)',
              pt: 8,
              pb: 3,
              px: 3,
              position: 'relative',
            }}
          >
            <Typography
              sx={{
                fontSize: '1.8rem',
                lineHeight: 1.5,
                textAlign: 'center',
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translate(-50%)',
                fontWeight: 900,
              }}
            >
              The Fracture
            </Typography>
            <Box
              sx={{
                backgroundColor: '#3c3c3c',
                height: '100%',
                backgroundImage: `url(${
                  done ? fractureGif.src : currentSelected && Fracture.src
                })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minWidth: '325px',
              }}
            />

            <Box
              onClick={() => setOpenDrawer(true)}
              sx={{
                cursor: 'pointer',
                '& img': {
                  position: 'absolute',
                  top: '55%',
                  left: '20%',
                  transform: 'translateY(-50%)',
                  maxHeight: '220px',
                  zIndex: 999,
                },
              }}
            >
              {addToSwapLoading ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%)',
                  }}
                >
                  <CircularProgress
                    thickness={4.6}
                    size={50}
                    sx={{ color: '#fff' }}
                  />
                </Box>
              ) : (
                <img
                  style={{ opacity: currentSelected ? '0' : '1' }}
                  src={plus.src}
                />
              )}
            </Box>
          </Box>
          <Box
            sx={{
              height: '325px',
              mt: 5,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '60px',
              flexDirection: 'column',
              '& svg': { fill: '#fff', maxWidth: 90 },
            }}
          >
            {currentSelected ? (
              <Box
                sx={{
                  mt: 0,
                  button: {
                    fontSize: '1.875rem',
                    padding: '10px 50px 10px 95px',
                    '& svg': {
                      position: 'absolute',
                      maxHeight: '45%',
                      left: '45px',
                      fill: '#fff',
                    },
                  },
                }}
              >
                {' '}
                <AnimatedButton onClick={() => handleClickSwap()}>
                  <SwapIcon /> Swap
                </AnimatedButton>
              </Box>
            ) : (
              <SwapIcon />
            )}
          </Box>
          <Box
            sx={{
              height: '325px',
              width: '100%',
              backgroundColor: '#ffffff0d',
              backdropFilter: 'blur(10px)',
              pt: 8,
              pb: 3,
              px: 3,
              position: 'relative',
            }}
          >
            <Typography
              sx={{
                fontSize: '1.8rem',
                lineHeight: 1.5,
                textAlign: 'center',
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translate(-50%)',
                fontWeight: 900,
              }}
            >
              Omnium
            </Typography>

            <Box
              sx={{
                backgroundColor: '#3c3c3c',
                height: '100%',
                backgroundImage: `url(${omnium.src})`,

                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minWidth: '285px',
                position: 'relative',
                zIndex: 1,
                '&::before': {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: '100%',
                  content: "''",
                  background: '#ffffffa6',
                  zIndex: -1,
                  opacity: done ? 0 : 1,
                },
              }}
            />
            <Box
              sx={{
                '& svg': {
                  position: 'absolute',
                  top: '35%',
                  left: '50%',
                  transform: 'translate(-50%)',
                  maxHeight: '175px',
                  zIndex: 999,
                  display: done ? 'none' : 'block',
                },
              }}
            >
              <QuestionSign />
            </Box>
          </Box>
        </Box>
      </Container>

      <Drawer
        anchor='top'
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant='h2'
            sx={{
              fontWeight: '900 !important',
              fontFamily: 'SandeMore-Regular !important',
              lineHeight: '1 !important',
              color: '#fff',
              marginBottom: 2,
            }}
          >
            MY Collection
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(10, 1fr)`,
              textAlign: 'center',
              gap: '20px',

              '& img': {
                maxWidth: '100%',
              },
            }}
          >
            {wallet.connected ? (
              <>
                {' '}
                {listNft.length ? (
                  listNft.map((nft, index) => (
                    <Box
                      onClick={() => handleClickList(index)}
                      key={index}
                      sx={{
                        pb: 2,
                        border: '2px solid #ffffff1a',
                        cursor: 'pointer',
                        transition: '.3s',
                        '&:hover': { borderColor: 'red' },
                      }}
                    >
                      <Box component='img' src={Fracture.src} />
                      <Typography
                        sx={{
                          fontWeight: '900 !important',
                          fontFamily: 'SandeMore-Regular !important',
                          lineHeight: '1 !important',
                          color: '#fff',
                        }}
                      >
                        The Fracture
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography
                    sx={{
                      fontWeight: '900 !important',
                      fontFamily: 'SandeMore-Regular !important',
                      lineHeight: '1 !important',
                      color: '#fff',
                      fontSize: '30px',
                      textAlign: 'left',
                      gridColumn: '1 / 10',
                    }}
                    className='glitch'
                    data-text={`You don't have any Fracture!`}
                  >
                    {`You don't have any Fracture!`}
                  </Typography>
                )}
              </>
            ) : (
              <Typography
                sx={{
                  fontWeight: '900 !important',
                  fontFamily: 'SandeMore-Regular !important',
                  lineHeight: '1 !important',
                  color: '#fff',
                  fontSize: '30px',
                  textAlign: 'left',
                  gridColumn: '1 / 10',
                }}
                className='glitch'
                data-text='Please Connect First to Load Collections'
              >
                Please Connect First to Load Collections
              </Typography>
            )}
          </Box>
        </Box>
      </Drawer>

      <Box
        sx={{
          '& .Toastify__toast': {
            backgroundColor: '#34160b',
            backdropFilter: 'blur(8px)',
            color: '#ffffffc9',
          },
          '& .Toastify__close-button': {
            color: '#fff !important',
          },
        }}
      >
        <ToastContainer
          position='bottom-left'
          autoClose={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          transition={Bounce}
        />
      </Box>
    </Box>
  );
}
