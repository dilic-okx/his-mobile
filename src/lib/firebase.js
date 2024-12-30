import Firebase, { RemoteMessage } from 'react-native-firebase'
// import { getToken, isNotificationsEnabled } from './core/utils'


export default async (RemoteMessage) => {
	console.log('message received', RemoteMessage)

	if (RemoteMessage) {
		Firebase.messaging().hasPermission()
			.then(() => {
				const notification = new Firebase.notifications.Notification({
					sound: 'default',
					show_in_foreground: true
				})
					.setNotificationId(RemoteMessage.messageId)
					.setTitle(RemoteMessage.data.app_name)
					.setBody(RemoteMessage.data.body)
					.setData({
						// key1: RemoteMessage.data.intercom_push_type,
						'msg_action': 'open',
						'conversation_id': RemoteMessage.data.conversation_id,
						'receiver': RemoteMessage.data.receiver

					})

				notification
					.android.setChannelId('his-djerdap')
					.android.setSmallIcon('ic_launcher')
					.android.setAutoCancel(true)
					.android.setPriority(Firebase.notifications.Android.Priority.High)
				

				Firebase.notifications().displayNotification(notification)

			})
			.catch(error => {
				console.log('error', error)
			})
	}

	return Promise.resolve()
}