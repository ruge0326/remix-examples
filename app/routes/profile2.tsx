// import { attributeField, prisma, profileValidationSchema } from '~/library'

// import { auth } from '~/auth.server'
// import { ActionFunction, json, LinksFunction, LoaderFunction, redirect } from '@remix-run/node'
// import { parseMultipartFormData } from '@remix-run/node/parseMultipartFormData'
// import { validationError } from 'remix-validated-form'
// import classnames from 'classnames'
// import { copyToClipboard, getBase64 } from '~/library'
// import React from 'react'
// import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap'
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
// import Tooltip from 'react-bootstrap/Tooltip'
// import { AlertPage } from '~/components/Pages/StaticPages/AlertPage/AlertPage'
// import { FormProvider, useForm } from 'react-hook-form'
// import useYupValidationResolver from '~/hooks/useYupValidationResolver'
// import { withYup } from '@remix-validated-form/with-yup'
// import { useActionData, useLoaderData, useFetcher } from '@remix-run/react'
// import { Routes } from '~/constants/routes'
// import { uploadHandler } from '~/utils.server'

// import alertPage from '~/styles/Pages/StaticPages/AlertPage/index.css'
// import profileStyles from '~/styles/Pages/Profile/index.css'

// export const links: LinksFunction = () => {
//   return [
//     {
//       rel: 'stylesheet',
//       href: profileStyles,
//     },
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

// export const validator = withYup(profileValidationSchema)

// export const action: ActionFunction = async ({ request }) => {
//   try {
//     const user = await auth.isAuthenticated(request)
//     if (!user) {
//       const redirect_to = new URL(request.url).pathname
//       const redirectParams = new URLSearchParams([['redirect_to', redirect_to]])

//       return redirect(`${Routes.SIGNIN_PAGE}?${redirectParams}`)
//     }
//     console.log('request', request)
//     const formData = await parseMultipartFormData(request, uploadHandler)
//     console.log('formData', formData)
//     // const data = await validator.validate(formData)
//     // if (data.error) return validationError(data.error)
//     // const { username, twitter, email, avatar } = data.data
//     // const profile = await prisma.accounts.update({
//     //   where: {
//     //     address: user?.address,
//     //   },
//     //   data:
//     //     avatar !== 'undefined'
//     //       ? { username, twitter, email, avatar }
//     //       : { username, twitter, email },
//     // })
//     return json({})
//   } catch (error) {
//     return json({
//       error,
//     })
//   }
// }

// export const loader: LoaderFunction = async ({ request }) => {
//   const user = await auth.isAuthenticated(request)
//   if (!user) {
//     return redirect('/sign-in?redirect_to=profile')
//   }
//   const profile = await prisma.accounts.findFirst({
//     where: {
//       address: user.address,
//     },
//   })
//   return json({ ...profile })
// }

// function ProfilePage() {
//   const refFile = React.useRef<HTMLInputElement>(null)
//   const data = useActionData<ProfileFormData>()
//   const profile = useLoaderData<ProfileFormData>()
//   const [isEdit, setIsEdit] = React.useState<boolean>(false)
//   const resolver = useYupValidationResolver(profileValidationSchema)
//   const fetcher = useFetcher()

//   const handelCopy = () => {
//     alert(data?.address)
//     console.log('data', data)
//     copyToClipboard(data?.address || '')
//   }

//   const methods = useForm<ProfileFormData>({
//     mode: 'all',
//     resolver,
//     defaultValues: profile,
//   })

//   const {
//     handleSubmit,
//     formState: { errors, touchedFields, isSubmitting, isValid },
//     register,
//     setValue,
//     trigger,
//     getValues,
//   } = methods

//   const onSubmit = async () => {
//     await fetcher.submit(getValues(), {
//       method: 'post',
//       encType: 'multipart/form-data',
//     })
//     setIsEdit(false)
//   }

//   const handelUpload = () => {
//     if (refFile.current) {
//       !isEdit && setIsEdit(true)
//       refFile.current.click()
//     }
//   }

//   const handleChangeFile = async (e: any) => {
//     const image = await getBase64(e.target.files[0])
//     setValue('avatar', image)
//     await trigger('avatar')
//   }

//   const renderTooltip = (props: any) => <Tooltip {...props}>Copied address!</Tooltip>

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
//         <FormProvider {...methods}>
//           <Form onSubmit={handleSubmit(onSubmit)}>
//             <Row className={classnames('blockProfiles', 'py-5')}>
//               <Col xs={12} lg={4}>
//                 <h3 className={classnames('titleUpload', 'text-center')}> Upload a Photo</h3>
//                 <div className={classnames('blockAvata', 'text-center', 'mt-3')}>
//                   <Image
//                     className={classnames('imageAvata', {
//                       'cursor-pointer': isEdit,
//                     })}
//                     alt="Avatar"
//                     onClick={handelUpload}
//                     src={getValues().avatar || '/images/photo-upload.png'}
//                   />
//                   <Image
//                     className={classnames('imageAvataItem', 'cursor-pointer', isEdit && 'cursor')}
//                     alt="Edit Avatar Icon"
//                     onClick={handelUpload}
//                     src={
//                       getValues().avatar ? '/images/edit-avata.png' : '/images/upload-picture-1.png'
//                     }
//                   />
//                 </div>
//                 <input
//                   type={'file'}
//                   className={'d-none'}
//                   {...register('avatar')}
//                   ref={refFile}
//                   onChange={handleChangeFile}
//                 />
//               </Col>
//               <Col xs={12} lg={8}>
//                 <div className={classnames('mr-auto', 'blockForm')}>
//                   <Form.Group className="mb-4">
//                     <Form.Label>Username*</Form.Label>
//                     {!isEdit ? (
//                       <Form.Label className="formValue">{getValues().username || 'n/a'}</Form.Label>
//                     ) : (
//                       <>
//                         <Form.Control
//                           className={`form-field`}
//                           {...register('username')}
//                           {...attributeField('isInvalid', errors.username, true)}
//                           isValid={!errors.username}
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {errors.username?.message}
//                         </Form.Control.Feedback>
//                       </>
//                     )}
//                   </Form.Group>
//                   <Form.Group className="mb-4">
//                     <Form.Label>Email Address*</Form.Label>
//                     {!isEdit ? (
//                       <Form.Label className="formValue">{getValues().email || 'n/a'}</Form.Label>
//                     ) : (
//                       <>
//                         <Form.Control
//                           className={`form-field`}
//                           {...register('email')}
//                           {...attributeField('isInvalid', errors.email, true)}
//                           isValid={!errors.email}
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {errors.email?.message}
//                         </Form.Control.Feedback>
//                       </>
//                     )}
//                   </Form.Group>
//                   <Form.Group className="mb-4">
//                     <Form.Label className="position-relative">
//                       Twitter Handle{' '}
//                       <Image
//                         alt="Twitter Icon"
//                         src="/images/twitter.png"
//                         width={33}
//                         height={27}
//                         className="twitterIcon"
//                       />
//                     </Form.Label>
//                     {!isEdit ? (
//                       <Form.Label className="formValue">{getValues().twitter || 'n/a'}</Form.Label>
//                     ) : (
//                       <>
//                         <Form.Control
//                           className={`form-field`}
//                           {...register('twitter')}
//                           {...attributeField('isInvalid', errors.twitter, touchedFields.twitter)}
//                           {...attributeField('isValid', errors.twitter, touchedFields.twitter)}
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {errors.twitter?.message}
//                         </Form.Control.Feedback>
//                       </>
//                     )}
//                   </Form.Group>
//                   <Form.Group className="mb-4 position-relative">
//                     <Form.Label>Wallet Address</Form.Label>
//                     <div className="position-relative">
//                       <Form.Control
//                         className="walletAddressInput"
//                         value={profile.address}
//                         readOnly
//                       />

//                       <OverlayTrigger
//                         trigger={'click'}
//                         placement="top"
//                         overlay={renderTooltip}
//                         rootClose
//                       >
//                         <div
//                           className={classnames('copyAddBtn', 'cursor-pointer')}
//                           onClick={() => handelCopy()}
//                         >
//                           <Image
//                             alt="Auction Icon"
//                             src="/images/icon/copy.svg"
//                             width={17}
//                             height={21}
//                           />
//                         </div>
//                       </OverlayTrigger>
//                     </div>
//                   </Form.Group>
//                   <div className="submitBtnWrapper">
//                     {!isEdit ? (
//                       <Button
//                         disabled={isSubmitting || fetcher.state === 'submitting'}
//                         variant="primary"
//                         className="mt-4"
//                         type="button"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           setIsEdit(true)
//                         }}
//                       >
//                         Edit Profile
//                       </Button>
//                     ) : (
//                       <Button
//                         variant="primary"
//                         className="mt-4"
//                         type="button"
//                         onClick={() => onSubmit()}
//                         disabled={!isValid || isSubmitting || fetcher.state === 'submitting'}
//                       >
//                         Save
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </Col>
//             </Row>
//           </Form>
//         </FormProvider>
//         <AlertPage when={isEdit} />
//       </div>
//     </Container>
//   )
// }

// export default ProfilePage

export default {};
