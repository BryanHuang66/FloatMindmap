import { profile } from "profile"
import { delayBreak, log, showHUD } from "utils/common"
import { util as autodetect } from "addons/autoDetect"
import {deleteNoteById,getNoteById} from "utils/note"
import {excerptHandler} from "addons/autoDetect"
let note: MbBookNote
let nodeNote: MbBookNote

let isOCR: boolean
let isComment: boolean
let isModifying: boolean
let lastExcerptText: string | undefined

export default async (_note: MbBookNote, _lastExcerptText?: string) => {
    log("开始处理摘录","handleExcerpt")
    excerptHandler(_note,_lastExcerptText)
    log("结束处理摘录","handleExcerpt")
}