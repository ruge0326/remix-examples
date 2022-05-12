// import { withZod } from '@remix-validated-form/with-zod'
// import { prisma } from '~/library'
// import alertPage from '~/styles/Pages/StaticPages/AlertPage/index.css'
// import { auth } from '~/auth.server'
// import {
//   ActionFunction,
//   json,
//   LinksFunction,
//   LoaderFunction,
//   redirect,
//   unstable_parseMultipartFormData,
//   UploadHandler,
//   useActionData,
//   useLoaderData,
// } from 'remix'
// import { useIsSubmitting, useIsValid, ValidatedForm, validationError } from 'remix-validated-form'
// import { z } from 'zod'
// import classnames from 'classnames'
// import { copyToClipboard, getBase64 } from '~/library'
// import React from 'react'
// import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap'
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
// import Tooltip from 'react-bootstrap/Tooltip'
// import { Input } from '~/components/Form/Input'
// import { MAX_FIRST_NAME, MIN_FIRST_NAME } from '~/constants/commons'
// import { uploadStreamToCloudinary } from '~/utils.server'
// import { AlertPage } from '~/components/Pages/StaticPages/AlertPage/AlertPage'

// export const links: LinksFunction = () => {
//   return [
//     {
//       rel: 'stylesheet',
//       href: alertPage,
//     },
//   ]
// }

// type ProfileFormData = {
//   email: string
//   username: string
//   twitter: string
//   avatar: string
//   address: string
// }

// export const validator = withZod(
//   z.object({
//     username: z
//       .string()
//       .nonempty('Username is required')
//       .min(MIN_FIRST_NAME, 'UserName  must be at least 2 characters')
//       .max(MAX_FIRST_NAME, 'UserName  length must not exceed 20 characters'),
//     twitter: z.string(),
//     avatar: z.any(),
//     email: z.string().nonempty('Email is required').email('Must be a valid email'),
//   }),
// )

// export const loader: LoaderFunction = async ({ request }) => {
//   const user = await auth.isAuthenticated(request)
//   if (!user) {
//     return redirect('sign-in?redirect_to=profile')
//   }
//   const profile = await prisma.accounts.findFirst({
//     where: {
//       address: user.address,
//     },
//   })
//   return json({ ...profile })
// }

// const uploadHandler: UploadHandler = async ({ name, stream, filename, mimetype }) => {
//   try {
//     if (name !== 'avatar' || !filename || !mimetype) {
//       stream.resume()
//       return
//     }
//     const uploadedImage = await uploadStreamToCloudinary(stream, {
//       public_id: new Date().getTime().toString(),
//       folder: '/raremint',
//     })
//     if (uploadedImage) return uploadedImage.secure_url
//   } catch (error) {
//     stream.resume()
//   }
// }

// export const action: ActionFunction = async ({ request }) => {
//   try {
//     const formData = await unstable_parseMultipartFormData(request, uploadHandler)
//     const data = await validator.validate(formData)
//     if (data.error) return validationError(data.error)
//     const { username, twitter, email, avatar } = data.data
//     const profile = await prisma.accounts.update({
//       where: {
//         address,
//       },
//       data: avatar ? { username, twitter, email, avatar } : { username, twitter, email },
//     })
//     return json(profile)
//   } catch (error) {
//     return json({
//       error,
//     })
//   }
// }

// function ProfilePage() {
//   const refFile = React.useRef<HTMLInputElement>(null)
//   const data = useActionData<ProfileFormData>()
//   const profile = useLoaderData<ProfileFormData>()
//   const [image, setImage] = React.useState<string>('')
//   const [isEdit, setIsEdit] = React.useState<boolean>(false)
//   const isSubmitting = useIsSubmitting('profile-form')
//   const isValid = useIsValid('profile-form')

//   const renderTooltip = (props: any) => <Tooltip {...props}>Copied address!</Tooltip>
//   const handelCopy = () => {
//     copyToClipboard(data?.address || '')
//   }

//   const handelUpload = () => {
//     if (refFile.current) {
//       refFile.current.click()
//     }
//   }

//   const handleChangeFile = async (e: any) => {
//     try {
//       const image = await getBase64(e.target.files[0])
//       setImage(image)
//     } catch (error) {}
//   }

//   const avatarImage = image || data?.avatar || profile?.avatar

//   const currentProfile = {
//     ...profile,
//     ...data,
//   }

//   React.useEffect(() => {
//     if (data) {
//       setIsEdit(false)
//     }
//   }, [data])

//   return (
//     <Container className="content">
//       <div className={classnames('mainProfile')}>
//         <h3 className={classnames('text-center', 'titleProfile', 'mb-4', 'd-none d-lg-block')}>
//           Profile Settings
//         </h3>
//         <h3 className={classnames('titleProfileMobile', 'd-lg-none')}>
//           <span className="mr-2">
//             <Image alt="Profile Icon" src="/images/icon/setting.svg" width={25} height={25} />
//           </span>{' '}
//           Profile Settings
//         </h3>
//         <ValidatedForm
//           validator={validator}
//           method="post"
//           id="profile-form"
//           noValidate={true}
//           encType="multipart/form-data"
//           defaultValues={currentProfile}
//           onSubmit={(result) => {
//             console.log('result', result)
//             // setIsEdit(false)
//           }}
//           disableFocusOnError={true}
//         >
//           <Row className={classnames('blockProfiles', 'py-5')}>
//             <Col xs={12} lg={4}>
//               <h3 className={classnames('titleUpload', 'text-center')}>Upload a Photo</h3>
//               <div className={classnames('blockAvata', 'text-center', 'mt-3')}>
//                 <Image
//                   className={classnames('imageAvata', {
//                     'cursor-pointer': isEdit,
//                   })}
//                   alt="Avatar"
//                   onClick={handelUpload}
//                   src={avatarImage || '/images/photo-upload.png'}
//                 />
//                 <Image
//                   className={classnames('imageAvataItem', 'cursor-pointer', isEdit && 'cursor')}
//                   alt="Edit Avatar Icon"
//                   onClick={handelUpload}
//                   src={avatarImage ? '/images/edit-avata.png' : '/images/upload-picture-1.png'}
//                 />
//               </div>
//               {isEdit && (
//                 <input
//                   name="avatar"
//                   type="file"
//                   className="d-none"
//                   ref={refFile}
//                   onChange={handleChangeFile}
//                 />
//               )}
//             </Col>
//             <Col xs={12} lg={8}>
//               <div className={classnames('mr-auto', 'blockForm')}>
//                 <Form.Group className="mb-4">
//                   {!isEdit ? (
//                     <>
//                       <Form.Label>Username*</Form.Label>
//                       <Form.Label className="formValue">
//                         {currentProfile.username || 'n/a'}
//                       </Form.Label>
//                     </>
//                   ) : (
//                     <Input name="username" label="Username" />
//                   )}
//                 </Form.Group>
//                 <Form.Group className="mb-4">
//                   {!isEdit ? (
//                     <>
//                       <Form.Label>Email Address*</Form.Label>
//                       <Form.Label className="formValue">{currentProfile.email || 'n/a'}</Form.Label>
//                     </>
//                   ) : (
//                     <Input name="email" label="Email Address" />
//                   )}
//                 </Form.Group>
//                 <Form.Group className="mb-4">
//                   <Form.Label className="position-relative">
//                     Twitter Handle{' '}
//                     <Image
//                       alt="Twitter Icon"
//                       src="/images/twitter.png"
//                       width={33}
//                       height={27}
//                       className="twitterIcon"
//                     />
//                   </Form.Label>
//                   {!isEdit ? (
//                     <>
//                       <Form.Label className="formValue">
//                         {currentProfile.twitter || 'n/a'}
//                       </Form.Label>
//                     </>
//                   ) : (
//                     <Input name="twitter" />
//                   )}
//                 </Form.Group>
//                 <Form.Group className="mb-4 position-relative">
//                   <Form.Label>Wallet Address</Form.Label>
//                   <div className="position-relative">
//                     <Form.Control
//                       className="walletAddressInput"
//                       readOnly
//                       value={data?.address || profile.address}
//                     />

//                     <OverlayTrigger
//                       trigger={'click'}
//                       placement="top"
//                       overlay={renderTooltip}
//                       rootClose
//                     >
//                       <div
//                         className={classnames('copyAddBtn', 'cursor-pointer')}
//                         onClick={() => handelCopy()}
//                       >
//                         <Image
//                           alt="Auction Icon"
//                           src="/images/icon/copy.svg"
//                           width={17}
//                           height={21}
//                         />
//                       </div>
//                     </OverlayTrigger>
//                   </div>
//                 </Form.Group>
//                 <div className="submitBtnWrapper">
//                   {!isEdit ? (
//                     <Button
//                       variant="primary"
//                       className={'mt-4'}
//                       type={'button'}
//                       onClick={(e) => {
//                         e.preventDefault()
//                         setIsEdit(true)
//                       }}
//                     >
//                       Edit Profile
//                     </Button>
//                   ) : (
//                     <Button className="mt-4" type="submit" disabled={!isValid || isSubmitting}>
//                       {isSubmitting ? 'Saving...' : 'Save'}
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </ValidatedForm>
//         <AlertPage when={isEdit} />
//         <h3
//           className={classnames('titleProfileMobile', 'd-lg-none')}
//           onClick={() => {
//             // TODO: go to SIGNIN_PAGE
//           }}
//         >
//           <span className="mr-2">
//             <Image alt="Logout Icon" src="/images/icon/logout.svg" width={21} height={21} />
//           </span>{' '}
//           Log Out
//         </h3>
//       </div>
//     </Container>
//   )
// }

// export default ProfilePage

export default {};
