import { lazy } from 'react'

// Lazy-loaded heavy components for code splitting
export const Dialog = lazy(() => import('./Dialog').then(m => ({ default: m.Dialog })))
export const DialogPortal = lazy(() => import('./Dialog').then(m => ({ default: m.DialogPortal })))
export const DialogOverlay = lazy(() => import('./Dialog').then(m => ({ default: m.DialogOverlay })))
export const DialogClose = lazy(() => import('./Dialog').then(m => ({ default: m.DialogClose })))
export const DialogTrigger = lazy(() => import('./Dialog').then(m => ({ default: m.DialogTrigger })))
export const DialogContent = lazy(() => import('./Dialog').then(m => ({ default: m.DialogContent })))
export const DialogHeader = lazy(() => import('./Dialog').then(m => ({ default: m.DialogHeader })))
export const DialogFooter = lazy(() => import('./Dialog').then(m => ({ default: m.DialogFooter })))
export const DialogTitle = lazy(() => import('./Dialog').then(m => ({ default: m.DialogTitle })))
export const DialogDescription = lazy(() => import('./Dialog').then(m => ({ default: m.DialogDescription })))

export const Table = lazy(() => import('./Table').then(m => ({ default: m.Table })))
export const TableHeader = lazy(() => import('./Table').then(m => ({ default: m.TableHeader })))
export const TableBody = lazy(() => import('./Table').then(m => ({ default: m.TableBody })))
export const TableFooter = lazy(() => import('./Table').then(m => ({ default: m.TableFooter })))
export const TableHead = lazy(() => import('./Table').then(m => ({ default: m.TableHead })))
export const TableRow = lazy(() => import('./Table').then(m => ({ default: m.TableRow })))
export const TableCell = lazy(() => import('./Table').then(m => ({ default: m.TableCell })))
export const TableCaption = lazy(() => import('./Table').then(m => ({ default: m.TableCaption })))

export const DropdownMenu = lazy(() => import('./Dropdown').then(m => ({ default: m.DropdownMenu })))
export const DropdownMenuTrigger = lazy(() => import('./Dropdown').then(m => ({ default: m.DropdownMenuTrigger })))
export const DropdownMenuContent = lazy(() => import('./Dropdown').then(m => ({ default: m.DropdownMenuContent })))
export const DropdownMenuItem = lazy(() => import('./Dropdown').then(m => ({ default: m.DropdownMenuItem })))
export const DropdownMenuCheckboxItem = lazy(() => import('./Dropdown').then(m => ({ default: m.DropdownMenuCheckboxItem })))
export const DropdownMenuRadioItem = lazy(() => import('./Dropdown').then(m => ({ default: m.DropdownMenuRadioItem })))
export const DropdownMenuLabel = lazy(() => import('./Dropdown').then(m => ({ default: m.DropdownMenuLabel })))
export const DropdownMenuSeparator = lazy(() => import('./Dropdown').then(m => ({ default: m.DropdownMenuSeparator })))
export const DropdownMenuShortcut = lazy(() => import('./Dropdown').then(m => ({ default: m.DropdownMenuShortcut })))
export const DropdownMenuGroup = lazy(() => import('./Dropdown').then(m => ({ default: m.DropdownMenuGroup })))
export const DropdownMenuPortal = lazy(() => import('./Dropdown').then(m => ({ default: m.DropdownMenuPortal })))
export const DropdownMenuSub = lazy(() => import('./Dropdown').then(m => ({ default: m.DropdownMenuSub })))
export const DropdownMenuSubContent = lazy(() => import('./Dropdown').then(m => ({ default: m.DropdownMenuSubContent })))
export const DropdownMenuSubTrigger = lazy(() => import('./Dropdown').then(m => ({ default: m.DropdownMenuSubTrigger })))
export const DropdownMenuRadioGroup = lazy(() => import('./Dropdown').then(m => ({ default: m.DropdownMenuRadioGroup })))

export const ToastProvider = lazy(() => import('./Toast').then(m => ({ default: m.ToastProvider })))
export const ToastViewport = lazy(() => import('./Toast').then(m => ({ default: m.ToastViewport })))
export const Toast = lazy(() => import('./Toast').then(m => ({ default: m.Toast })))
export const ToastTitle = lazy(() => import('./Toast').then(m => ({ default: m.ToastTitle })))
export const ToastDescription = lazy(() => import('./Toast').then(m => ({ default: m.ToastDescription })))
export const ToastClose = lazy(() => import('./Toast').then(m => ({ default: m.ToastClose })))
export const ToastAction = lazy(() => import('./Toast').then(m => ({ default: m.ToastAction })))

// Type exports
export type { ToastProps, ToastActionElement } from './Toast'
