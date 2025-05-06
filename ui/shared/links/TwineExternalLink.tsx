import type { LinkProps } from '@chakra-ui/react';
import { Link, chakra, Box } from '@chakra-ui/react';
import React from 'react';

import { getExplorerBlockUrl, getExplorerTxUrl } from 'configs/app/features/twine';
import Skeleton from 'ui/shared/chakra/Skeleton';
import IconSvg from 'ui/shared/IconSvg';

import type { Variants } from './useLinkStyles';
import { useLinkStyles } from './useLinkStyles';

interface Props {
  href: string;
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: Variants;
  iconColor?: LinkProps['color'];
  onClick?: LinkProps['onClick'];
  chainId: string;
  type?: 'tx' | 'block';
}

const TwineExternalLink = ({ href, children, className, isLoading, variant, iconColor, onClick, chainId, type = 'tx' }: Props) => {
  const commonProps = {
    display: 'inline-block',
    alignItems: 'center',
  };

  const styleProps = useLinkStyles(commonProps, variant);

  if (isLoading) {
    if (variant === 'subtle') {
      return (
        <Skeleton className={ className } { ...styleProps } bgColor="inherit">
          { children }
          <Box boxSize={ 3 } display="inline-block"/>
        </Skeleton>
      );
    }

    return (
      <Box className={ className } { ...styleProps }>
        { children }
        <Skeleton boxSize={ 3 } verticalAlign="middle" display="inline-block"/>
      </Box>
    );
  }

  const externalUrl = type === 'tx' ? getExplorerTxUrl(chainId, href) : getExplorerBlockUrl(chainId, href);

  return (
    <Link className={ className } { ...styleProps } target="_blank" href={ externalUrl } onClick={ onClick }>
      { children }
      <IconSvg name="link_external" boxSize={ 3 } verticalAlign="middle" color={ iconColor ?? 'icon_link_external' } flexShrink={ 0 }/>
    </Link>
  );
};

export default React.memo(chakra(TwineExternalLink));
