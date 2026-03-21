import ChildComponent from '@/core/component/child.component'
import { $R } from '@/core/rquery/rquery.lib'
import { SERVER_URL } from '@/config/url.config'
import renderService from '@/core/services/render.service'

import styles from './user-item.module.scss'
import template from './user-item.template.html'

const DEFAULT_AVATAR_PATH = '/uploads/default-avatar.png'

function resolveAvatarPath(avatarPath = DEFAULT_AVATAR_PATH) {
	if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
		return avatarPath
	}

	return `${SERVER_URL}${avatarPath}`
}

export class UserItem extends ChildComponent {
	constructor(user, isGray = false, onClick) {
		super()

		if (!user) throw new Error('User should be passed!')
		if (!user?.name) throw new Error('User must have a "name"!')

		this.user = user
		this.onClick = onClick
		this.isGray = isGray
	}

	#preventDefault(event) {
		event.preventDefault()
	}

	update({ avatarPath, name }) {
		if (!name) return

		const imgElement = this.element.querySelector('img')
		const fallbackAvatarPath = resolveAvatarPath()

		imgElement.onerror = () => {
			if (imgElement.getAttribute('src') !== fallbackAvatarPath) {
				imgElement.setAttribute('src', fallbackAvatarPath)
				return
			}

			imgElement.onerror = null
		}

		imgElement.setAttribute('src', resolveAvatarPath(avatarPath))
		imgElement.setAttribute('alt', name)

		$R(this.element).find('span').text(name)
	}

	render() {
		this.element = renderService.htmlToElement(template, [], styles)

		this.update(this.user)

		$R(this.element).click(this.onClick || this.#preventDefault.bind(this))

		if (!this.onClick) $R(this.element).attr('disabled', '')
		if (this.isGray) $R(this.element).addClass(styles.gray)

		return this.element
	}
}
