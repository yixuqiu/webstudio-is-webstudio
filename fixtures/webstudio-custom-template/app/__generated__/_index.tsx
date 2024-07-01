/* eslint-disable */
/* This is a auto generated file for building the project */

import { Fragment, useState } from "react";
import type { FontAsset, ImageAsset } from "@webstudio-is/sdk";
import { useResource } from "@webstudio-is/react-sdk";
import {
  Body as Body,
  Link as Link,
} from "@webstudio-is/sdk-components-react-remix";
import {
  Heading as Heading,
  Vimeo as Vimeo,
  VimeoPreviewImage as VimeoPreviewImage,
  VimeoPlayButton as VimeoPlayButton,
  Box as Box,
  HtmlEmbed as HtmlEmbed,
  VimeoSpinner as VimeoSpinner,
  Image as Image,
} from "@webstudio-is/sdk-components-react";

export const siteName = "Fixture Site";

export const favIconAsset: ImageAsset | undefined = {
  id: "cd1e9fad-8df1-45c6-800f-05fda2d2469f",
  name: "home_wsKvRSqvkajPPBeycZ-C8.svg",
  description: null,
  projectId: "0d856812-61d8-4014-a20a-82e01c0eb8ee",
  size: 3350,
  type: "image",
  format: "svg",
  createdAt: "2023-10-30T20:35:47.113Z",
  meta: { width: 16, height: 16 },
};

export const socialImageAsset: ImageAsset | undefined = {
  id: "ff546bd2-9bb1-4717-a180-1a1fc05565dd",
  name: "_937084ed-a798-49fe-8664-df93a2af605e_1JqSy_0Wy9fY5mXNZSLJ0.jpeg",
  description: null,
  projectId: "0d856812-61d8-4014-a20a-82e01c0eb8ee",
  size: 210614,
  type: "image",
  format: "jpg",
  createdAt: "2024-03-26T18:31:04.086Z",
  meta: { width: 1024, height: 1024 },
};

// Font assets on current page (can be preloaded)
export const pageFontAssets: FontAsset[] = [
  {
    id: "a8fb692a-5970-4014-ad4d-45c6f1edea36",
    name: "CormorantGaramond-Medium_-nWJ-OtHncaW9xDHQ9hSA_CBl88Oo59QKH_z9pCWva2.woff2",
    description: null,
    projectId: "0d856812-61d8-4014-a20a-82e01c0eb8ee",
    size: 156212,
    type: "font",
    createdAt: "2024-02-22T05:36:52.004Z",
    format: "woff2",
    meta: { family: "Cormorant Garamond", style: "normal", weight: 500 },
  },
];

export const pageBackgroundImageAssets: ImageAsset[] = [
  {
    id: "cd1e9fad-8df1-45c6-800f-05fda2d2469f",
    name: "home_wsKvRSqvkajPPBeycZ-C8.svg",
    description: null,
    projectId: "0d856812-61d8-4014-a20a-82e01c0eb8ee",
    size: 3350,
    type: "image",
    format: "svg",
    createdAt: "2023-10-30T20:35:47.113Z",
    meta: { width: 16, height: 16 },
  },
];

const Script = ({ children, ...props }: Record<string, string | boolean>) => {
  if (children == null) {
    return <script {...props} />;
  }

  return <script {...props} dangerouslySetInnerHTML={{ __html: children }} />;
};
const Style = ({ children, ...props }: Record<string, string | boolean>) => {
  if (children == null) {
    return <style {...props} />;
  }

  return <style {...props} dangerouslySetInnerHTML={{ __html: children }} />;
};

export const CustomCode = () => {
  return (
    <>
      <Script>{"console.log('HELLO')"}</Script>
      {"\n"}
      <meta property={"saas:test"} content={"test"}></meta>
    </>
  );
};

const Page = ({}: { system: any }) => {
  return (
    <Body
      data-ws-id="ibXgMoi9_ipHx1gVrvii0"
      data-ws-component="Body"
      className="cjrgi00"
    >
      <Heading
        data-ws-id="7pwqBSgrfuuOfk1JblWcL"
        data-ws-component="Heading"
        className="ce7mxws cd0g70b c1ku1ozg c1kbs9xq c1m6kmmg crjoqt7 c1n5sjmn c1hqh3e6 cwdggon c4o64du"
      >
        {"DO NOT TOUCH THIS PROJECT, IT'S USED FOR FIXTURES"}
      </Heading>
      <Box
        data-ws-id="GMg3Wi9tJBFMtKcwbIK6z"
        data-ws-component="Box"
        className="cxb89wn c12qr5j7 c111rqf8 cp8i2p0 cwfevk3"
      >
        <Image
          data-ws-id="Mfd_mI-VJtT4r7gICAvXi"
          data-ws-component="Image"
          src={
            "/custom-folder/_937084ed-a798-49fe-8664-df93a2af605e_1JqSy_0Wy9fY5mXNZSLJ0.jpeg"
          }
          width={1024}
          height={1024}
          className="ccgiojm cv4f3rn cer5re4 c9lz7ss"
        />
        <Box
          data-ws-id="COafOppxs73Ne4O0Geik0"
          data-ws-component="Box"
          className="ccgiojm cv4f3rn cer5re4 c9lz7ss"
        />
      </Box>
      <Heading data-ws-id="jWb8SRMYG_XPWqCYvGZjo" data-ws-component="Heading">
        {"Below Image"}
      </Heading>
      <HtmlEmbed
        data-ws-id="PI0W8MDhnG1glS5zDm8HQ"
        data-ws-component="HtmlEmbed"
        code={
          "<script>console.log('PAGE MAIN Client')</script>\n<script>console.log('PAGE MAIN 2 Client')</script>\nSCRIPTS ARE HERE <br>"
        }
        clientOnly={true}
      />
      <HtmlEmbed
        data-ws-id="ffuOk2adQRwdmAPbN0C02"
        data-ws-component="HtmlEmbed"
        code={
          "<script>console.log('PAGE MAIN SSR')</script>\n<script>console.log('PAGE MAIN 2 SSR')</script>\nSCRIPTS ARE HERE <br>"
        }
      />
      <Link
        data-ws-id="QzTSoZnbGD6luZ5xcv893"
        data-ws-component="Link"
        href={"/script-test"}
      >
        {"Goto Scr"}
      </Link>
      <Vimeo
        data-ws-id="ZkDuD4HlHP3pDdp0SXJuh"
        data-ws-component="Vimeo"
        url={"https://player.vimeo.com/video/831343124"}
        showPreview={true}
        className="c17osjft c5kxibo c8mrdqb"
      >
        <VimeoPreviewImage
          data-ws-id="wxd8Wul8dl2yPRFFedNn6"
          data-ws-component="VimeoPreviewImage"
          alt={"Vimeo video preview image"}
          sizes={"100vw"}
          src={"/custom-folder/home_wsKvRSqvkajPPBeycZ-C8.svg"}
          className="c13adha2 c19kjzjn c8mrdqb chv0hit c1vw7ut7 c64vnj4 cow7xo6 cddunt6 cqjhyu2"
        />
        <VimeoSpinner
          data-ws-id="o8sAMUoaOraWYZClEfRgl"
          data-ws-component="VimeoSpinner"
          className="c13adha2 c1ifzo79 c1ljqvnn c10zke2u cplzsl2 c1ardg8l ces5mo3"
        >
          <HtmlEmbed
            data-ws-id="BeQ7sgDlUizFvf4aHqOsh"
            data-ws-component="HtmlEmbed"
            code={
              '<svg xmlns="http://www.w3.org/2000/svg" id="e2CRglijn891" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" viewBox="0 0 128 128" fill="currentColor" width="100%" height="100%" style="display: block;"><style>@keyframes e2CRglijn892_tr__tr{0%{transform:translate(64px,64px) rotate(90deg);animation-timing-function:cubic-bezier(.42,0,.58,1)}50%{transform:translate(64px,64px) rotate(810deg);animation-timing-function:cubic-bezier(.42,0,.58,1)}to{transform:translate(64px,64px) rotate(1530deg)}}@keyframes e2CRglijn892_s_p{0%,to{stroke:#39fbbb}25%{stroke:#4a4efa}50%{stroke:#e63cfe}75%{stroke:#ffae3c}}@keyframes e2CRglijn892_s_do{0%{stroke-dashoffset:251.89}2.5%,52.5%{stroke-dashoffset:263.88;animation-timing-function:cubic-bezier(.42,0,.58,1)}25%,75%{stroke-dashoffset:131.945}to{stroke-dashoffset:251.885909}}#e2CRglijn892_tr{animation:e2CRglijn892_tr__tr 3000ms linear infinite normal forwards}#e2CRglijn892{animation-name:e2CRglijn892_s_p,e2CRglijn892_s_do;animation-duration:3000ms;animation-fill-mode:forwards;animation-timing-function:linear;animation-direction:normal;animation-iteration-count:infinite}</style><g id="e2CRglijn892_tr" transform="translate(64,64) rotate(90)"><circle id="e2CRglijn892" r="42" fill="none" stroke="#39fbbb" stroke-dasharray="263.89" stroke-dashoffset="251.89" stroke-linecap="round" stroke-width="16" transform="scale(-1,1) translate(0,0)"/></g></svg>'
            }
            executeScriptOnCanvas={false}
          />
        </VimeoSpinner>
        <VimeoPlayButton
          data-ws-id="9hBBPGSf7hB30ZkSHKjNd"
          data-ws-component="VimeoPlayButton"
          aria-label={"Play button"}
          className="c13adha2 c1t88ri8 ca7kf99 c1ifzo79 c1ljqvnn c1bld9op ctly9e6 cxb89wn cwcnvqs cvchf4 c1y7dyx c1bnrgjg c1joowif c120xed6 c2eug5n cvwgylz c1f0qcby c1syyj1x cil01r8 c11087u4 coba2o7 c82nx6d"
        >
          <Box
            data-ws-id="D__QElBIIQtamhJN3a4FI"
            data-ws-component="Box"
            aria-hidden={"true"}
            className="c1cccshn c1eyznz"
          >
            <HtmlEmbed
              data-ws-id="iEc6hab-WardXZc5P9wJu"
              data-ws-component="HtmlEmbed"
              code={
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" fill="currentColor" width="100%" height="100%" style="display: block;"><path d="M4.766 5.765c0-.725 0-1.088.178-1.288a.93.93 0 0 1 .648-.294c.294-.015.65.186 1.359.588l9.234 5.235c.586.332.88.498.982.708.09.183.09.389 0 .572-.102.21-.396.376-.982.708l-9.234 5.235c-.71.402-1.065.603-1.359.588a.93.93 0 0 1-.648-.294c-.178-.2-.178-.563-.178-1.288V5.765Z"/></svg>'
              }
            />
          </Box>
        </VimeoPlayButton>
      </Vimeo>
    </Body>
  );
};

export { Page };
