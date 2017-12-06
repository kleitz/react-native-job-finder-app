package com.sealjobsrecruiter;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.marcshilling.idletimer.IdleTimerPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.rnfs.RNFSPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.bugsnag.BugsnagReactNative;
import com.actionsheet.ActionSheetPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new PickerPackage(),
            new IdleTimerPackage(),
            new RNI18nPackage(),
            new RNFSPackage(),
            new FIRMessagingPackage(),
            new RNDeviceInfo(),
            new ReactNativeConfigPackage(),
            BugsnagReactNative.getPackage(),
            new ActionSheetPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
